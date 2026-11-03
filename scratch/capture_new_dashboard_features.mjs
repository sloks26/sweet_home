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

  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,1100',
    '--user-data-dir=/tmp/chrome-features-profile'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9231/json/list');
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

    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
    await new Promise((r) => setTimeout(r, 3500));

    // Captura 1: Vista superior (KPIs, Meta mensual y gráfica)
    const shotTop = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_dashboard_with_sales_goal.png`, Buffer.from(shotTop.data, 'base64'));
    console.log('📸 1. verified_dashboard_with_sales_goal.png saved!');

    // Scroll hacia el bloque intermedio (Top 5 productos y Envíos/Mensajería)
    await sendCmd('Runtime.evaluate', {
      expression: `window.scrollBy(0, 550);`
    });
    await new Promise((r) => setTimeout(r, 1000));

    const shotMiddle = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_dashboard_top_products_and_shipping.png`, Buffer.from(shotMiddle.data, 'base64'));
    console.log('📸 2. verified_dashboard_top_products_and_shipping.png saved!');

    // Scroll hacia Apartados con botón WhatsApp y Stock crítico
    await sendCmd('Runtime.evaluate', {
      expression: `window.scrollBy(0, 600);`
    });
    await new Promise((r) => setTimeout(r, 1000));

    const shotBottom = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_dashboard_apartados_whatsapp_and_stock.png`, Buffer.from(shotBottom.data, 'base64'));
    console.log('📸 3. verified_dashboard_apartados_whatsapp_and_stock.png saved!');

    ws.close();
  } finally {
    chrome.kill();
  }
}

capture().catch(console.error);
