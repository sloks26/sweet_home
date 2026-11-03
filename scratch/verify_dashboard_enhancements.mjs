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
  const { token } = await tokenRes.json();

  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9255',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,1050',
    '--user-data-dir=/tmp/chrome-dashboard-scroll'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9255/json/list');
    const targets = await listRes.json();
    const page = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();
    function sendCmd(method, params = {}) {
      const i = id++;
      return new Promise((res, rej) => {
        pending.set(i, { res, rej });
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    }
    ws.on('message', d => {
      const msg = JSON.parse(d.toString());
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id).res(msg.result);
        pending.delete(msg.id);
      }
    });
    await new Promise(r => ws.on('open', r));
    await sendCmd('Page.enable');
    await sendCmd('Network.enable');
    await sendCmd('Runtime.enable');
    await sendCmd('Network.setCookie', { name: 'token', value: token, domain: '174.138.62.86', path: '/' });

    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise(r => setTimeout(r, 3000));

    // Cambiar a panel admin
    await sendCmd('Runtime.evaluate', {
      expression: `
        const adminBtn = Array.from(document.querySelectorAll('button, a, span')).find(e => e.textContent && e.textContent.includes('Panel Admin'));
        if (adminBtn) adminBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 2500));

    // 1. Capturar Gráfica con selector de Comparativa / Solo Ingresos / Solo Egresos
    await sendCmd('Runtime.evaluate', {
      expression: `
        const main = document.querySelector('main');
        if (main) main.scrollTop = 320;
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const chartShot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_chart_with_mode_selector.png`, Buffer.from(chartShot.data, 'base64'));
    console.log('Guardado verified_chart_with_mode_selector.png');

    // 2. Capturar Top Productos Estrella (con el #1 dorado claramente visible!)
    await sendCmd('Runtime.evaluate', {
      expression: `
        const main = document.querySelector('main');
        if (main) main.scrollTop = 620;
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const topShot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_top_products_ranking_one_visible.png`, Buffer.from(topShot.data, 'base64'));
    console.log('Guardado verified_top_products_ranking_one_visible.png');

    // 3. Capturar Sección de Clientes mostrando AMBAS tablas (Apartados Y Contra Entrega) simultáneamente
    await sendCmd('Runtime.evaluate', {
      expression: `
        const main = document.querySelector('main');
        if (main) main.scrollTop = 1050;
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const clientsShot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_both_apartados_and_contraentrega_visible.png`, Buffer.from(clientsShot.data, 'base64'));
    console.log('Guardado verified_both_apartados_and_contraentrega_visible.png');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill('SIGKILL');
  }
}
capture();
