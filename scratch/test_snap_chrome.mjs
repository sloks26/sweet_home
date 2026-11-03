import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function capture() {
  const tokenRes = await fetch('http://174.138.62.86:8081/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sweethomeboutiquecr.com', password: 'SweetHomeCR2026!#' })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.token;
  console.log('Login token obtained:', token ? 'YES' : 'NO');

  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,950',
    '--user-data-dir=/tmp/chrome-verified-admin-profile'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9227/json/list');
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

    // Inyectar cookie real mediante Network.setCookie con URL exacta
    await sendCmd('Network.setCookie', {
      name: 'token',
      value: token,
      url: 'http://174.138.62.86:8081/'
    });

    // Navegar directamente al admin dashboard
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
    await new Promise((r) => setTimeout(r, 3500));

    // Captura 1: Dashboard Contabilidad Desktop
    const shot1 = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_dashboard_accounting.png`, Buffer.from(shot1.data, 'base64'));
    console.log('📸 1. verified_admin_dashboard_accounting.png saved!');

    // Cambiar a vista móvil iPhone (390x844)
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Navegar a Categorías
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const catBtn = btns.find(b => b.textContent.includes('Categorías'));
          if (catBtn) catBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Abrir modal de editar categoría
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const editBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Editar'));
          if (editBtns.length > 0) editBtns[0].click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Captura 2: Modal de categoría en móvil
    const shotCat = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_category_modal_mobile.png`, Buffer.from(shotCat.data, 'base64'));
    console.log('📸 2. verified_category_modal_mobile.png saved!');

    // Cerrar modal de categoría y navegar a Productos
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cancelar'));
          if (cancelBtn) cancelBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const prodBtn = btns.find(b => b.textContent.includes('Productos'));
          if (prodBtn) prodBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Abrir modal de producto
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Nuevo Producto'));
          if (addBtn) addBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Captura 3: Modal de Producto con 3+ fotos y subida directa
    const shotProd = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_product_modal_mobile.png`, Buffer.from(shotProd.data, 'base64'));
    console.log('📸 3. verified_product_modal_mobile.png saved!');

    ws.close();
  } finally {
    chrome.kill();
  }
}

capture().catch(console.error);
