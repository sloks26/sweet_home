import { spawn } from 'child_process';
import WebSocket from 'ws';
import fs from 'fs';

async function runTest() {
  console.log('🚀 Iniciando Chromium headless para verificación completa...');
  const chrome = spawn('/snap/bin/chromium', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    '--user-data-dir=/tmp/chrome-verify-profile'
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

    // Esperar a que la página cargue y pinte
    await new Promise((r) => setTimeout(r, 3500));

    // 1. Verificar API /api/home
    const apiRes = await fetch('http://174.138.62.86:8081/api/home');
    const apiData = await apiRes.json();
    console.log('\n--- VERIFICACIÓN DE API HOME ---');
    console.log('Categorías en API:', apiData.data?.categories?.length);
    const adultCat = apiData.data?.categories?.find(c => c.slug === 'bienestar-intimo');
    console.log('Bienestar Íntimo imagen en API:', adultCat?.image === null ? 'CORRECTO (null)' : adultCat?.image);
    console.log('Banners en API:', apiData.data?.banners?.length);
    console.log('StoreSettings en API:', apiData.data?.storeSettings ? 'PRESENTE' : 'AUSENTE');
    console.log('StoreSettings Teléfono:', apiData.data?.storeSettings?.phone);

    // 2. Evaluar DOM en la vista pública (Invitada / Sin sesión)
    console.log('\n--- VERIFICACIÓN DEL DOM (VISTA PÚBLICA / INVITADO) ---');
    const domEval = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        // A. Verificar botones admin visibles
        const adminBtn = Array.from(document.querySelectorAll('button, a')).find(el => 
          el.textContent.includes('Panel Admin') || el.textContent.includes('Acceso Administrador')
        );
        
        // B. Beneficios (color de fondo y tamaño de texto)
        const benefitsSec = document.querySelector('#beneficios') || Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Envíos a Todo Costa Rica'));
        const benefitsBg = benefitsSec ? window.getComputedStyle(benefitsSec).backgroundColor : null;

        // C. Nuestra Historia: Drop cap y nota de muestra
        const storySec = document.querySelector('#nuestra-historia');
        const hasSampleNote = storySec ? storySec.textContent.includes('Texto y fotografía de muestra') : false;
        const storyText = storySec ? storySec.textContent : '';
        const hasHoy = storyText.includes('Hoy, gracias a la confianza');
        const hasSplitHoy = storyText.includes('H oy');

        // D. Footer: Acceso Administrador visible o no
        const footerText = document.querySelector('footer')?.textContent || '';
        const footerHasAdminLink = footerText.includes('Acceso Administrador') || footerText.includes('🔒');

        return {
          adminBtnFound: !!adminBtn,
          benefitsBg,
          hasSampleNote,
          hasHoy,
          hasSplitHoy,
          footerHasAdminLink
        };
      })()`,
      returnByValue: true
    });

    console.log('Resultados DOM público:', domEval.result.value);

    // 3. Probar MegaMenú: Hover sobre categoría Hogar
    console.log('\n--- VERIFICACIÓN DE MEGA-MENÚ ---');
    // Disparar hover sobre el primer botón de categoría en la barra de navegación
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const catBtn = document.querySelectorAll('nav button')[0]; // Hogar
        if (catBtn) {
          catBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }
      })()`
    });

    // Esperar 250ms (por encima de los 120ms de intención de hover)
    await new Promise((r) => setTimeout(r, 350));

    const megaMenuEval = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const panel = document.querySelector('div[role="region"]') || Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('Explorar catálogo'));
        if (!panel) return { open: false };
        const bg = window.getComputedStyle(panel).backgroundColor;
        const img = panel.querySelector('img');
        const hasFixedText = panel.textContent.includes('Exclusivo en Costa Rica');
        return {
          open: true,
          bg,
          hasImage: !!img,
          imgSrc: img ? img.src : null,
          hasFixedText
        };
      })()`,
      returnByValue: true
    });
    console.log('Mega-menú Hogar abierto:', megaMenuEval.result.value);

    // 4. Probar MegaMenú para Bienestar Íntimo (+18)
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('nav button'));
        const adultBtn = btns.find(b => b.textContent.includes('Bienestar'));
        if (adultBtn) {
          adultBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }
      })()`
    });

    await new Promise((r) => setTimeout(r, 350));

    const adultMenuEval = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const panel = Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('Discreción Absoluta'));
        if (!panel) return { open: false };
        const img = panel.querySelector('img');
        return {
          open: true,
          hasImage: !!img,
          text: panel.textContent.slice(0, 150)
        };
      })()`,
      returnByValue: true
    });
    console.log('Mega-menú Bienestar Íntimo abierto (sin imagen):', adultMenuEval.result.value);

    // Tomar captura de pantalla de escritorio
    const screenshot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/tmp/verify_desktop_final.png', Buffer.from(screenshot.data, 'base64'));
    console.log('📸 Captura de escritorio guardada en /tmp/verify_desktop_final.png');

    // 5. Verificación Móvil (Viewport 390x844)
    console.log('\n--- VERIFICACIÓN EN MÓVIL (390x844) ---');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await sendCmd('Page.navigate', { url: 'http://174.138.62.86:8081' });
    await new Promise((r) => setTimeout(r, 2500));

    const mobileEval = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        // Abrir drawer móvil
        const menuBtn = document.querySelector('button[aria-label="Abrir menú de navegación"]') || document.querySelector('button svg.lucide-menu')?.closest('button');
        if (menuBtn) menuBtn.click();
        return { menuBtnFound: !!menuBtn };
      })()`,
      returnByValue: true
    });

    await new Promise((r) => setTimeout(r, 600));

    const mobileDrawerEval = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const bodyText = document.body.textContent;
        const hasAdminAccess = bodyText.includes('Acceso Panel Administrativo');
        const hasClientLogin = bodyText.includes('Iniciar Sesión / Mi Cuenta') || bodyText.includes('Mi Cuenta');
        return { hasAdminAccess, hasClientLogin };
      })()`,
      returnByValue: true
    });
    console.log('Drawer móvil evaluado:', mobileDrawerEval.result.value);

    const mobileScreenshot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/tmp/verify_mobile_final.png', Buffer.from(mobileScreenshot.data, 'base64'));
    console.log('📸 Captura móvil guardada en /tmp/verify_mobile_final.png');

    console.log('\n🎉 TODAS LAS VERIFICACIONES COMPLETADAS.');
    ws.close();
  } catch (err) {
    console.error('Error durante la verificación:', err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

runTest();
