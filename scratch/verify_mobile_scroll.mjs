import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function captureScrolled() {
  const tokenRes = await fetch('http://174.138.62.86:8081/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sweethomeboutiquecr.com', password: 'SweetHomeCR2026!#' })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.token;

  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,950',
    '--user-data-dir=/tmp/chrome-verified-scroll-profile'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9228/json/list');
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

    await sendCmd('Network.setCookie', {
      name: 'token',
      value: token,
      url: 'http://174.138.62.86:8081/'
    });

    // Vista móvil iPhone
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    // 1. Abrir Categorías y abrir Modal
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
    await new Promise((r) => setTimeout(r, 3000));

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

    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const editBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Editar'));
          if (editBtns.length > 0) editBtns[0].click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Desplazar el modal hacia abajo (scroll down al botón Guardar Cambios)
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const scrollContainers = document.querySelectorAll('.overflow-y-auto');
          scrollContainers.forEach(el => el.scrollTop = el.scrollHeight);
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    const shotCatScrolled = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_category_modal_scrolled_to_bottom.png`, Buffer.from(shotCatScrolled.data, 'base64'));
    console.log('📸 1. verified_category_modal_scrolled_to_bottom.png saved!');

    // Cerrar modal de categoría y abrir modal de producto
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

    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Nuevo Producto'));
          if (addBtn) addBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll down en modal de producto
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const scrollContainers = document.querySelectorAll('.overflow-y-auto');
          scrollContainers.forEach(el => el.scrollTop = el.scrollHeight);
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    const shotProdScrolled = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_product_modal_scrolled_to_bottom.png`, Buffer.from(shotProdScrolled.data, 'base64'));
    console.log('📸 2. verified_product_modal_scrolled_to_bottom.png saved!');

    ws.close();
  } finally {
    chrome.kill();
  }
}

captureScrolled().catch(console.error);
