import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import { WebSocket } from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function capture() {
  const chrome = spawn('/snap/bin/chromium', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1280,900'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://127.0.0.1:9224/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

      ws.on('open', () => {
        let msgId = 1;
        const send = (method, params = {}) => ws.send(JSON.stringify({ id: msgId++, method, params }));

        send('Page.enable');
        send('Runtime.enable');

        // Navegar a la tienda
        send('Page.navigate', { url: 'http://174.138.62.86:8081' });

        setTimeout(() => {
          // Iniciar sesión como admin en localStorage
          send('Runtime.evaluate', {
            expression: `
              fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@sweethomeboutiquecr.com', password: 'SweetHomeCR2026!#' })
              })
              .then(r => r.json())
              .then(d => {
                localStorage.setItem('sh_token', d.token);
                localStorage.setItem('sh_user', JSON.stringify(d.user));
                window.location.hash = '#admin';
                window.location.reload();
              });
            `
          });

          setTimeout(() => {
            // Captura 1: Dashboard contabilidad Desktop
            ws.on('message', (raw) => {
              const resp = JSON.parse(raw);
              if (resp.result && resp.result.data) {
                fs.writeFileSync(`${ARTIFACT_DIR}/verified_accounting_dashboard_desktop.png`, Buffer.from(resp.result.data, 'base64'));
                console.log('✅ Screenshot saved: verified_accounting_dashboard_desktop.png');
                chrome.kill();
                process.exit(0);
              }
            });

            send('Page.captureScreenshot');
          }, 3500);
        }, 2000);
      });
    });
  });
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
