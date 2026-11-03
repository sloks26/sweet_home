import { spawn } from 'child_process';
import WebSocket from 'ws';
import fs from 'fs';

async function runTest() {
  console.log('🚀 Iniciando Chromium headless...');
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    '--user-data-dir=/tmp/chrome-verify-profile-2'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await listRes.json();
    const page = targets.find((t) => t.type === 'page');

    if (!page) throw new Error('No page target found');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let msgId = 1;
    const pendingPromises = new Map();

    function sendCmd(method, params = {}) {
      const id = msgId++;
      return new Promise((resolve, reject) => {
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id && pendingPromises.has(msg.id)) {
        const { resolve } = pendingPromises.get(msg.id);
        pendingPromises.delete(msg.id);
        resolve(msg.result);
      }
    });

    await new Promise((resolve) => ws.on('open', resolve));

    await sendCmd('Page.enable');
    await sendCmd('Runtime.enable');
    await sendCmd('DOM.enable');

    console.log('🌐 Navegando a http://174.138.62.86:8081...');
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 3500));

    // Obtener coordenadas del botón Hogar en la barra de navegación
    const coords = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('#category-bar-container a'));
        const hogarBtn = links.find(b => b.textContent.includes('Hogar'));
        if (!hogarBtn) return { error: 'Not found', linksCount: links.length };
        const r = hogarBtn.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, found: true };
      })()`,
      returnByValue: true
    });
    console.log('Coordenadas del botón Hogar:', coords.result.value);

    if (coords.result.value && coords.result.value.found) {
      // Mover el ratón con CDP sobre el botón
      await sendCmd('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: coords.result.value.x,
        y: coords.result.value.y
      });

      // Esperar 400ms (retraso hover intent es 120ms)
      await new Promise((r) => setTimeout(r, 500));

      const menuCheck = await sendCmd('Runtime.evaluate', {
        expression: `(() => {
          const panel = document.querySelector('div[role="region"]');
          if (!panel) return { open: false };
          const img = panel.querySelector('img');
          const badge = panel.querySelector('span.text-gold-bright');
          const title = panel.querySelector('h4');
          return {
            open: true,
            hasImage: !!img,
            imgSrc: img ? img.src : null,
            badge: badge ? badge.textContent : null,
            title: title ? title.textContent : null,
            bg: window.getComputedStyle(panel).backgroundColor
          };
        })()`,
        returnByValue: true
      });
      console.log('Estado Mega-menú Hogar tras hover:', menuCheck.result.value);

      // Capturar screenshot con el mega-menú desplegado
      const screenshot = await sendCmd('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/phase6_megamenu_hogar.png', Buffer.from(screenshot.data, 'base64'));
      console.log('📸 Captura mega-menú guardada en phase6_megamenu_hogar.png');

      // Ahora mover el ratón al botón "Bienestar Íntimo (+18)"
      const adultCoords = await sendCmd('Runtime.evaluate', {
        expression: `(() => {
          const links = Array.from(document.querySelectorAll('#category-bar-container a'));
          const adultBtn = links.find(b => b.textContent.includes('Bienestar'));
          if (!adultBtn) return null;
          const r = adultBtn.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2, found: true };
        })()`,
        returnByValue: true
      });

      if (adultCoords.result.value && adultCoords.result.value.found) {
        await sendCmd('Input.dispatchMouseEvent', {
          type: 'mouseMoved',
          x: adultCoords.result.value.x,
          y: adultCoords.result.value.y
        });

        await new Promise((r) => setTimeout(r, 500));

        const adultCheck = await sendCmd('Runtime.evaluate', {
          expression: `(() => {
            const panel = document.querySelector('div[role="region"]');
            if (!panel) return { open: false };
            const img = panel.querySelector('img');
            return {
              open: true,
              hasImage: !!img,
              textSnippet: panel.textContent.slice(0, 150)
            };
          })()`,
          returnByValue: true
        });
        console.log('Estado Mega-menú Bienestar Íntimo (+18):', adultCheck.result.value);

        const screenshotAdult = await sendCmd('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/phase6_megamenu_adult.png', Buffer.from(screenshotAdult.data, 'base64'));
        console.log('📸 Captura Bienestar Íntimo guardada en phase6_megamenu_adult.png');
      }
    }

    // Probar vista móvil
    console.log('\n--- PROBANDO VISTA MÓVIL (390x844) ---');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 2500));

    // Abrir menú lateral móvil
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label="Abrir menú de navegación"]') || document.querySelector('button svg.lucide-menu')?.closest('button');
        if (btn) btn.click();
      })()`
    });
    await new Promise((r) => setTimeout(r, 600));

    const mobileScreenshot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/phase6_mobile_drawer.png', Buffer.from(mobileScreenshot.data, 'base64'));
    console.log('📸 Captura móvil drawer guardada en phase6_mobile_drawer.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

runTest();
