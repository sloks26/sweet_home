import { spawn } from 'child_process';
import WebSocket from 'ws';
import fs from 'fs';

async function runTest() {
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    '--user-data-dir=/tmp/chrome-verify-profile-3'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await listRes.json();
    const page = targets.find((t) => t.type === 'page');

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
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 3500));

    // Obtener coordenadas de Bienestar Íntimo
    const adultCoords = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('#category-bar-container a'));
        const adultBtn = links.find(b => b.textContent.includes('Bienestar'));
        if (!adultBtn) return null;
        const r = adultBtn.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: adultBtn.textContent };
      })()`,
      returnByValue: true
    });
    console.log('Botón Bienestar encontrado:', adultCoords.result.value);

    if (adultCoords.result.value) {
      await sendCmd('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: adultCoords.result.value.x,
        y: adultCoords.result.value.y
      });

      await new Promise((r) => setTimeout(r, 400));

      const adultMenuCheck = await sendCmd('Runtime.evaluate', {
        expression: `(() => {
          const panel = document.querySelector('div[role="region"]');
          if (!panel) return { open: false };
          const imgs = Array.from(panel.querySelectorAll('img'));
          const lockIcon = panel.querySelector('svg.lucide-lock');
          const discretionText = panel.textContent.includes('Discreción Absoluta');
          const adultLabel = panel.textContent.includes('Verificación +18');
          return {
            open: true,
            imgCount: imgs.length,
            hasLockIcon: !!lockIcon,
            hasDiscretionNotice: discretionText,
            hasAdultLabel: adultLabel,
            title: panel.querySelector('h3')?.textContent
          };
        })()`,
        returnByValue: true
      });
      console.log('Evaluación Bienestar Íntimo MegaMenú:', adultMenuCheck.result.value);

      const shot = await sendCmd('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/phase6_megamenu_adult_verified.png', Buffer.from(shot.data, 'base64'));
      console.log('📸 Captura Bienestar Íntimo guardada en phase6_megamenu_adult_verified.png');
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

runTest();
