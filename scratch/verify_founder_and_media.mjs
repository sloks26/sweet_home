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
    '--remote-debugging-port=9240',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,950',
    '--user-data-dir=/tmp/chrome-tab-verify'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9240/json/list');
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
      domain: '174.138.62.86',
      path: '/'
    });

    console.log('Navegando a Admin...');
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 3000));

    // Cambiar vista a admin
    await sendCmd('Runtime.evaluate', {
      expression: `
        // Click on "Panel Admin" button at bottom-left
        const btn = Array.from(document.querySelectorAll('button, a, span')).find(e => e.textContent && e.textContent.includes('Panel Admin'));
        if (btn) btn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Click en "Biblioteca de Medios"
    console.log('Clickeando Biblioteca de Medios...');
    await sendCmd('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Biblioteca de Medios'));
        if (btn) btn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    const mediaShot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_media_library_clean.png`, Buffer.from(mediaShot.data, 'base64'));
    console.log('Guardado verified_admin_media_library_clean.png');

    // 2. Click en "Nuestra Historia"
    console.log('Clickeando Nuestra Historia...');
    await sendCmd('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Nuestra Historia'));
        if (btn) btn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    const storyShot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_our_story_saved.png`, Buffer.from(storyShot.data, 'base64'));
    console.log('Guardado verified_admin_our_story_saved.png');

  } catch (err) {
    console.error('Error durante captura:', err);
  } finally {
    chrome.kill('SIGKILL');
  }
}

capture();
