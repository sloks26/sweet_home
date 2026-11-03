import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function main() {
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--user-data-dir=/tmp/chrome-admin-profile'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json/list');
    const targets = await listRes.json();
    const page = targets.find((t) => t.type === 'page');

    if (!page) {
      console.error('No page target found');
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let msgId = 1;
    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (data) => {
          const res = JSON.parse(data.toString());
          if (res.id === id) {
            ws.off('message', handler);
            resolve(res);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await new Promise((r) => ws.on('open', r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navegando a la tienda...');
    await send('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 3000));

    // 1. Simular login admin mediante evaluación en la consola del navegador
    console.log('Iniciando sesión como administradora en el frontend...');
    const loginEval = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'admin@sweethomeboutiquecr.com',
              password: 'SweetHomeCR2026!#'
            })
          });
          const data = await res.json();
          if (data.success) {
            // Guardar usuario en localStorage o disparar recarga para que App.jsx lo tome
            localStorage.setItem('sh_auth_user', JSON.stringify(data.user));
            window.location.hash = '#admin';
            window.location.reload();
          }
          return data;
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Login eval result:', loginEval.result?.value);
    await new Promise((r) => setTimeout(r, 4000));

    // Captura 1: Dashboard
    console.log('Capturando pantalla del Dashboard...');
    const dashShot = await send('Page.captureScreenshot', { format: 'png' });
    if (dashShot.result?.data) {
      const buffer = Buffer.from(dashShot.result.data, 'base64');
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase6_admin_dashboard.png'), buffer);
      console.log('Guardado: phase6_admin_dashboard.png');
    }

    // Navegar a la pestaña Pedidos
    console.log('Cambiando a pestaña Pedidos...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const ordersBtn = buttons.find(b => b.textContent.includes('Pedidos & SINPE') || b.textContent.includes('Revisar Comprobantes Ahora'));
          if (ordersBtn) ordersBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Captura 2: Pedidos
    console.log('Capturando pantalla de Pedidos & SINPE...');
    const ordersShot = await send('Page.captureScreenshot', { format: 'png' });
    if (ordersShot.result?.data) {
      const buffer = Buffer.from(ordersShot.result.data, 'base64');
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase6_admin_orders.png'), buffer);
      console.log('Guardado: phase6_admin_orders.png');
    }

    // Navegar a la pestaña Productos
    console.log('Cambiando a pestaña Productos...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const prodsBtn = buttons.find(b => b.textContent.trim() === 'Productos');
          if (prodsBtn) prodsBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Captura 3: Productos
    console.log('Capturando pantalla de Productos...');
    const prodsShot = await send('Page.captureScreenshot', { format: 'png' });
    if (prodsShot.result?.data) {
      const buffer = Buffer.from(prodsShot.result.data, 'base64');
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase6_admin_products.png'), buffer);
      console.log('Guardado: phase6_admin_products.png');
    }

    // Navegar a la pestaña Ajustes de Tienda
    console.log('Cambiando a pestaña Ajustes de Tienda...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const btn = buttons.find(b => b.textContent.includes('Ajustes de Tienda'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    const settingsShot = await send('Page.captureScreenshot', { format: 'png' });
    if (settingsShot.result?.data) {
      const buffer = Buffer.from(settingsShot.result.data, 'base64');
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase6_admin_settings.png'), buffer);
      console.log('Guardado: phase6_admin_settings.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error durante captura:', err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

main();
