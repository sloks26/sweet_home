import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function main() {
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--user-data-dir=/tmp/chrome-features-verify'
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9229/json/list');
    const targets = await listRes.json();
    const page = targets.find((t) => t.type === 'page');

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

    console.log('1. Navegando al Home de Sweet Home & Boutique CR...');
    await send('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 2500));

    // Abrir un producto para verificar el botón de WhatsApp
    console.log('2. Abriendo detalle de producto...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.editorial-card');
          if (card) card.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Capturar pantalla del modal de producto con botón de WhatsApp
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_product_detail_whatsapp.png`, Buffer.from(snap1.result.data, 'base64'));
    console.log('📸 Captura 1 guardada: verified_product_detail_whatsapp.png');

    // Cerrar modal
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = document.querySelector('button[aria-label="Cerrar detalle"], button[aria-label="Cerrar"]');
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 800));

    // Iniciar sesión como Vanessa
    console.log('3. Iniciando sesión como Vanessa (admin@sweethomeboutiquecr.com)...');
    const loginVanessa = await send('Runtime.evaluate', {
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
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          return data;
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Login Vanessa éxito:', loginVanessa.result?.result?.value?.success);

    // Navegar a #admin
    await send('Runtime.evaluate', { expression: `window.location.hash = '#admin'` });
    await new Promise((r) => setTimeout(r, 2500));

    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_vanessa_greeting.png`, Buffer.from(snap2.result.data, 'base64'));
    console.log('📸 Captura 2 guardada: verified_admin_vanessa_greeting.png');

    // Iniciar sesión como Jendry
    console.log('4. Iniciando sesión como Jendry (jendry@sweethomeboutiquecr.com)...');
    const loginJendry = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'jendry@sweethomeboutiquecr.com',
              password: 'SweetHomeCR2026!#'
            })
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          return data;
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Login Jendry éxito:', loginJendry.result?.result?.value?.success);

    await send('Runtime.evaluate', { expression: `window.location.hash = '#admin'; location.reload();` });
    await new Promise((r) => setTimeout(r, 2500));

    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_jendry_greeting.png`, Buffer.from(snap3.result.data, 'base64'));
    console.log('📸 Captura 3 guardada: verified_admin_jendry_greeting.png');

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
  }
}

main().then(() => {
  console.log('✅ Verificación visual completada.');
  process.exit(0);
}).catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
