import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function runVerification() {
  console.log('1. Autenticando con API de Sweet Home...');
  const loginRes = await fetch('http://174.138.62.86:8081/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sweethomeboutiquecr.com', password: 'SweetHomeCR2026!#' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Token obtenido:', token ? 'SÍ (OK)' : 'FALLIDO');

  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
    '--user-data-dir=/tmp/chrome-dashboard-p2'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9229/json/list');
    const targets = await listRes.json();
    const page = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();

    function sendCmd(method, params = {}) {
      const id = msgId++;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.on('message', (d) => {
      const msg = JSON.parse(d.toString());
      if (msg.id && pending.has(msg.id)) {
        const { resolve } = pending.get(msg.id);
        pending.delete(msg.id);
        resolve(msg.result);
      }
    });

    await new Promise((r) => ws.on('open', r));
    await sendCmd('Page.enable');
    await sendCmd('Network.enable');
    await sendCmd('Runtime.enable');

    // Inyectar cookie de autenticación
    await sendCmd('Network.setCookie', {
      name: 'token',
      value: token,
      url: 'http://174.138.62.86:8081/'
    });

    // Emular pantalla iPhone 14/15 (390 x 844 px)
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    console.log('2. Navegando al panel en móvil (390px)...');
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
    await new Promise((r) => setTimeout(r, 2500));

    // Si el modal de login está abierto, pulsar el botón "Ingresar"
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ingresar'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 3000));

    // Captura 1: Dashboard Móvil (Inicio, Action Center, Bottom Bar)
    const snap1 = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_mobile_dashboard.png`, Buffer.from(snap1.data, 'base64'));
    console.log('✓ Captura 1 guardada: verified_admin_mobile_dashboard.png');

    // Clic en la tarjeta de Comprobantes por verificar o navegar a Pedidos
    console.log('3. Navegando a Gestión de Pedidos en móvil...');
    await sendCmd('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[title*="pedidos" i], [href="#orders"], button:has(svg)');
        // Buscar el botón de navegación a pedidos en la barra inferior
        const navBtns = Array.from(document.querySelectorAll('nav button, button'));
        const ordersTab = navBtns.find(b => b.textContent.includes('Pedidos'));
        if (ordersTab) ordersTab.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Captura 2: Lista de Pedidos en Móvil (Tarjetas)
    const snap2 = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_mobile_orders.png`, Buffer.from(snap2.data, 'base64'));
    console.log('✓ Captura 2 guardada: verified_admin_mobile_orders.png');

    // Clic en la pestaña de Productos en la barra inferior
    console.log('4. Navegando a Catálogo de Productos en móvil...');
    await sendCmd('Runtime.evaluate', {
      expression: `
        const navBtns = Array.from(document.querySelectorAll('button'));
        const prodTab = navBtns.find(b => b.textContent.includes('Productos'));
        if (prodTab) prodTab.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Captura 3: Productos en móvil (Tarjetas con miniatura 52px)
    const snap3 = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_mobile_products.png`, Buffer.from(snap3.data, 'base64'));
    console.log('✓ Captura 3 guardada: verified_admin_mobile_products.png');

    // Cambiar a viewport Desktop (1280 x 850)
    console.log('5. Cambiando a vista Desktop (1280px)...');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 850,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Volver a Inicio / Dashboard en desktop
    await sendCmd('Runtime.evaluate', {
      expression: `
        const navBtns = Array.from(document.querySelectorAll('button'));
        const homeTab = navBtns.find(b => b.textContent.includes('Inicio') || b.textContent.includes('Dashboard'));
        if (homeTab) homeTab.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2500));

    // Captura 4: Dashboard en Desktop
    const snap4 = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_desktop_dashboard.png`, Buffer.from(snap4.data, 'base64'));
    console.log('✓ Captura 4 guardada: verified_admin_desktop_dashboard.png');

    ws.close();
    chrome.kill();
    console.log('Verificación completada exitosamente.');
  } catch (err) {
    console.error('Error durante verificación:', err);
    chrome.kill();
  }
}

runVerification();
