import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function main() {
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--user-data-dir=/tmp/chrome-user-test-' + Date.now()
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9230/json/list');
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

    console.log('1. Navegando al Home con hash #admin para abrir el Login...');
    await send('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
    await new Promise((r) => setTimeout(r, 2000));

    // Llenar formulario de login para Vanessa
    console.log('2. Escribiendo credenciales de Vanessa...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const emailInput = document.querySelector('input[type="email"]');
          const passInput = document.querySelector('input[type="password"]');
          if (emailInput && passInput) {
            emailInput.value = 'admin@sweethomeboutiquecr.com';
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            passInput.value = 'SweetHomeCR2026!#';
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `
    });

    console.log('3. Haciendo click en Ingresar al Panel...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button[type="submit"]');
          if (btn) btn.click();
        })()
      `
    });

    // Esperar a que se procese el login y aparezca el saludo
    await new Promise((r) => setTimeout(r, 800));

    // Captura del saludo en el modal
    const snapModal = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_vanessa_modal_greeting.png`, Buffer.from(snapModal.result.data, 'base64'));
    console.log('📸 Captura guardada: verified_admin_vanessa_modal_greeting.png');

    // Esperar a que se abra el panel admin
    await new Promise((r) => setTimeout(r, 2500));

    // Captura del panel admin con el saludo personalizado a Vanessa en el header y sidebar
    const snapPanelVanessa = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_vanessa_panel.png`, Buffer.from(snapPanelVanessa.result.data, 'base64'));
    console.log('📸 Captura guardada: verified_admin_vanessa_panel.png');

    // Ahora probar con Jendry
    console.log('4. Cerrando sesión de Vanessa...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Click en botón Salir o Cerrar Sesión
          const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cerrar Sesión') || b.innerText.includes('Salir'));
          if (logoutBtn) logoutBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Abrir de nuevo el login modal con #admin
    await send('Runtime.evaluate', { expression: `window.location.hash = '#admin'` });
    await new Promise((r) => setTimeout(r, 1500));

    // Escribir credenciales de Jendry
    console.log('5. Escribiendo credenciales de Jendry...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const emailInput = document.querySelector('input[type="email"]');
          const passInput = document.querySelector('input[type="password"]');
          if (emailInput && passInput) {
            emailInput.value = 'jendry@sweethomeboutiquecr.com';
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            passInput.value = 'SweetHomeCR2026!#';
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `
    });

    console.log('6. Haciendo click en Ingresar al Panel para Jendry...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button[type="submit"]');
          if (btn) btn.click();
        })()
      `
    });

    // Esperar a que se abra el panel admin
    await new Promise((r) => setTimeout(r, 3000));

    const snapPanelJendry = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_jendry_panel.png`, Buffer.from(snapPanelJendry.result.data, 'base64'));
    console.log('📸 Captura guardada: verified_admin_jendry_panel.png');

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
  }
}

main().then(() => {
  console.log('✅ Verificación completada con éxito.');
  process.exit(0);
}).catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
