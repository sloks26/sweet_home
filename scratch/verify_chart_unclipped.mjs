import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function verify() {
  console.log('1. Autenticando...');
  const loginRes = await fetch('http://174.138.62.86:8081/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sweethomeboutiquecr.com', password: 'SweetHomeCR2026!#' })
  });
  const { token } = await loginRes.json();
  console.log('Token:', !!token);

  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,950',
    '--user-data-dir=/tmp/chrome-chart-unclipped'
  ]);

  // Esperar a que el puerto esté disponible
  let connected = false;
  let targets = [];
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      targets = await res.json();
      if (targets.length > 0) {
        connected = true;
        break;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!connected) {
    console.error('No se pudo conectar a Chromium');
    chrome.kill();
    return;
  }

  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  function cmd(method, params = {}) {
    const curId = id++;
    return new Promise(res => {
      pending.set(curId, res);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.on('message', d => {
    const msg = JSON.parse(d);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });

  await new Promise(r => ws.on('open', r));
  await cmd('Page.enable');
  await cmd('Network.enable');
  await cmd('Runtime.enable');

  await cmd('Network.setCookie', {
    name: 'token',
    value: token,
    url: 'http://174.138.62.86:8081/'
  });

  console.log('2. Navegando a #admin...');
  await cmd('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
  await new Promise(r => setTimeout(r, 3500));

  console.log('3. Haciendo scroll al gráfico...');
  await cmd('Runtime.evaluate', {
    expression: `window.scrollBy(0, 800);`
  });
  await new Promise(r => setTimeout(r, 1000));

  // Get coordinates of Dom 1 bar in .group.relative
  const pos = await cmd('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const cols = Array.from(document.querySelectorAll('.group.relative'));
        if (cols.length > 5) {
          const domCol = cols[5]; // Sunday
          const rect = domCol.getBoundingClientRect();
          return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        }
        return null;
      })()
    `
  });

  if (pos.value) {
    console.log('Barra Dom 1 en:', pos.value);
    await cmd('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: pos.value.x,
      y: pos.value.y
    });
    await new Promise(r => setTimeout(r, 600));
  }

  const snap = await cmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACT_DIR}/verified_chart_tooltip_unclipped.png`, Buffer.from(snap.data, 'base64'));
  console.log('✓ Captura guardada: verified_chart_tooltip_unclipped.png');

  ws.close();
  chrome.kill();
}

verify().catch(console.error);
