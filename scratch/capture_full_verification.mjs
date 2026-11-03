import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import { WebSocket } from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

// Obtener token de autenticación
async function getAuthToken() {
  const res = await fetch('http://174.138.62.86:8081/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@sweethomeboutiquecr.com',
      password: 'SweetHomeCR2026!#'
    })
  });
  const data = await res.json();
  return data.token;
}

async function run() {
  const token = await getAuthToken();
  console.log('Got auth token:', token ? 'OK' : 'FAIL');

  const chrome = spawn('/snap/bin/chromium', [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1280,950'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://127.0.0.1:9225/json', (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

      ws.on('open', async () => {
        let msgId = 1;
        const call = (method, params = {}) => new Promise((resolve) => {
          const id = msgId++;
          const handler = (m) => {
            const parsed = JSON.parse(m);
            if (parsed.id === id) {
              ws.off('message', handler);
              resolve(parsed.result);
            }
          };
          ws.on('message', handler);
          ws.send(JSON.stringify({ id, method, params }));
        });

        await call('Page.enable');
        await call('Network.enable');

        // Configurar cookie de sesión
        await call('Network.setCookie', {
          name: 'token',
          value: token,
          domain: '174.138.62.86',
          path: '/'
        });

        // 1. Navegar al Admin Dashboard
        await call('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
        await new Promise(r => setTimeout(r, 4000));

        // Captura Desktop Dashboard
        const shot1 = await call('Page.captureScreenshot');
        if (shot1 && shot1.data) {
          fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_dashboard_with_accounting.png`, Buffer.from(shot1.data, 'base64'));
          console.log('✅ 1. verified_admin_dashboard_with_accounting.png saved');
        }

        // 2. Cambiar a vista móvil (iPhone 390x844)
        await call('Emulation.setDeviceMetricsOverride', {
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          mobile: true
        });
        await new Promise(r => setTimeout(r, 1500));

        const shot2 = await call('Page.captureScreenshot');
        if (shot2 && shot2.data) {
          fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_dashboard_mobile.png`, Buffer.from(shot2.data, 'base64'));
          console.log('✅ 2. verified_admin_dashboard_mobile.png saved');
        }

        chrome.kill();
        process.exit(0);
      });
    });
  });
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
