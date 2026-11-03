import { spawn } from 'child_process';
import WebSocket from 'ws';
import fs from 'fs';

async function verifyFixes() {
  console.log('🚀 Lanzando Chromium para capturar screenshots de verificación...');
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1366,768',
    '--user-data-dir=/tmp/chrome-fixes-profile'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json/list');
    const targets = await listRes.json();
    const page = targets.find((t) => t.type === 'page');
    if (!page) throw new Error('No page found');

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

    await new Promise((r) => (ws.on('open', r)));

    await sendCmd('Page.enable');
    await sendCmd('DOM.enable');

    console.log('Navegando a la tienda...');
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 3000));

    // Captura del Header
    const shot1 = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/verified_header_logo.png', Buffer.from(shot1.data, 'base64'));
    console.log('📸 Header guardado en verified_header_logo.png');

    // Click en Moda para abrir catálogo
    console.log('Haciendo clic en Moda...');
    await sendCmd('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('a'));
          const moda = links.find(a => a.textContent.includes('Moda'));
          if (moda) moda.click();
        })()
      `
    });

    await new Promise((r) => setTimeout(r, 2500));

    // Captura del catálogo Moda
    const shot2 = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/verified_catalog_moda.png', Buffer.from(shot2.data, 'base64'));
    console.log('📸 Catálogo Moda guardado en verified_catalog_moda.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

verifyFixes().catch(console.error);
