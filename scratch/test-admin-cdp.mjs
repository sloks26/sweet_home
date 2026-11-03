import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function main() {
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--user-data-dir=/tmp/chrome-admin-prof-3'
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9227/json/list');
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

    console.log('1. Navegando al Home...');
    await send('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 2000));

    console.log('2. Iniciando sesión como admin...');
    const loginRes = await send('Runtime.evaluate', {
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
          return await res.json();
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Login res:', loginRes.result?.result?.value?.success);

    console.log('3. Navegando a #admin...');
    await send('Runtime.evaluate', {
      expression: `window.location.hash = '#admin'`
    });
    await new Promise((r) => setTimeout(r, 2500));

    const checkDom = await send('Runtime.evaluate', {
      expression: `
        ({
          hasAside: !!document.querySelector('aside'),
          h1: document.querySelector('h1')?.innerText,
          navButtons: Array.from(document.querySelectorAll('aside nav button')).map(b => b.innerText.trim())
        })
      `,
      returnByValue: true
    });
    console.log('DOM Admin Check:', checkDom.result?.result?.value);

    // Capturar Dashboard
    console.log('Capturando phase6_admin_dashboard.png...');
    const s1 = await send('Page.captureScreenshot', { format: 'png' });
    if (s1.result?.data) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase6_admin_dashboard.png'), Buffer.from(s1.result.data, 'base64'));
    }

    // Clic en Pedidos
    console.log('Cambiando a pestaña Pedidos...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Pedidos'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    console.log('Capturando phase6_admin_orders.png...');
    const s2 = await send('Page.captureScreenshot', { format: 'png' });
    if (s2.result?.data) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase6_admin_orders.png'), Buffer.from(s2.result.data, 'base64'));
    }

    // Clic en Productos
    console.log('Cambiando a pestaña Productos...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Productos'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    console.log('Capturando phase6_admin_products.png...');
    const s3 = await send('Page.captureScreenshot', { format: 'png' });
    if (s3.result?.data) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'phase6_admin_products.png'), Buffer.from(s3.result.data, 'base64'));
    }

    console.log('✅ Capturas guardadas con éxito.');
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

main();
