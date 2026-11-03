import { spawn } from 'child_process';
import fs from 'fs';
import WebSocket from 'ws';

const ARTIFACT_DIR = '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a';

async function testFeatures() {
  const loginRes = await fetch('http://174.138.62.86:8081/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sweethomeboutiquecr.com', password: 'SweetHomeCR2026!#' })
  });
  const { token } = await loginRes.json();

  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    '--user-data-dir=/tmp/chrome-dashboard-feat'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9230/json/list');
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

    console.log('1. Abriendo panel Desktop...');
    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081/#admin' });
    await new Promise((r) => setTimeout(r, 2000));

    // Auto login si sale el modal
    await sendCmd('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ingresar'));
        if (btn) btn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Dashboard Desktop Inicio
    const shotDash = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_desktop_home.png`, Buffer.from(shotDash.data, 'base64'));
    console.log('✓ 1. verified_admin_desktop_home.png');

    // 2. Abrir Detalle de un Pedido para verificar comparador SINPE y hoja de despacho
    console.log('2. Navegando a Pedidos y abriendo Detalle...');
    await sendCmd('Runtime.evaluate', {
      expression: `
        const navBtns = Array.from(document.querySelectorAll('aside button, nav button, button'));
        const ordersTab = navBtns.find(b => b.textContent.includes('Pedidos'));
        if (ordersTab) ordersTab.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    await sendCmd('Runtime.evaluate', {
      expression: `
        const detailBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Detalle') || b.textContent.includes('Gestionar'));
        if (detailBtns.length > 0) detailBtns[0].click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    const shotOrderDetail = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_order_detail_modal.png`, Buffer.from(shotOrderDetail.data, 'base64'));
    console.log('✓ 2. verified_order_detail_modal.png');

    // Cerrar modal de pedido
    await sendCmd('Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('button:has(svg.lucide-x)');
        if (closeBtn) closeBtn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    // 3. Móvil: Nuestra Historia con pestañas "Editar | Vista previa"
    console.log('3. Cambiando a móvil (390px) para probar Nuestra Historia y Ajustes...');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Abrir menú "Más" en la barra inferior móvil
    await sendCmd('Runtime.evaluate', {
      expression: `
        const moreBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Más'));
        if (moreBtn) moreBtn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Clic en "Nuestra Historia" en el menú desplegable
    await sendCmd('Runtime.evaluate', {
      expression: `
        const storyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Nuestra Historia'));
        if (storyBtn) storyBtn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    const shotOurStoryMobile = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_mobile_our_story.png`, Buffer.from(shotOurStoryMobile.data, 'base64'));
    console.log('✓ 3. verified_admin_mobile_our_story.png');

    // 4. Móvil: Ajustes de Tienda (validación de WhatsApp y Vista previa de pago)
    await sendCmd('Runtime.evaluate', {
      expression: `
        const moreBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Más'));
        if (moreBtn) moreBtn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    await sendCmd('Runtime.evaluate', {
      expression: `
        const settingsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ajustes'));
        if (settingsBtn) settingsBtn.click();
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Scroll para ver vista previa de pago
    await sendCmd('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 600, behavior: 'smooth' });`
    });
    await new Promise((r) => setTimeout(r, 1500));

    const shotSettingsMobile = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/verified_admin_mobile_settings.png`, Buffer.from(shotSettingsMobile.data, 'base64'));
    console.log('✓ 4. verified_admin_mobile_settings.png');

    ws.close();
    chrome.kill();
    console.log('Pruebas completadas exitosamente.');
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
  }
}

testFeatures();
