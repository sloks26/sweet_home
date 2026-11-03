import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function capture() {
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9280',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,950',
    '--user-data-dir=/tmp/chrome-capture-11-12'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9280/json/list');
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
    await sendCmd('Runtime.enable');
    await sendCmd('Network.enable');

    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise(r => setTimeout(r, 3000));

    // 1. Hero Carousel Screenshot
    const heroShot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_hero_carousel_1_1.png`, Buffer.from(heroShot.data, 'base64'));
    console.log('Saved verified_hero_carousel_1_1.png');

    // 2. Benefits section screenshot
    await sendCmd('Runtime.evaluate', {
      expression: `
        const el = Array.from(document.querySelectorAll('h3')).find(e => e.textContent && e.textContent.includes('SINPE Móvil Oficial'));
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const benefitsShot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_benefits_section_1_2.png`, Buffer.from(benefitsShot.data, 'base64'));
    console.log('Saved verified_benefits_section_1_2.png');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill('SIGKILL');
  }
}
capture();
