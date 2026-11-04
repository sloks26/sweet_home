import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('1. Navegando al sitio en vivo...');
  await page.goto('http://174.138.62.86:8081/', { waitUntil: 'networkidle2' });

  // 1. Verificar botón de WhatsApp en la vista rápida o detalle de producto
  console.log('2. Abriendo detalle de un producto...');
  const firstCard = await page.$('.editorial-card');
  if (firstCard) {
    await firstCard.click();
    await new Promise((r) => setTimeout(r, 1500));

    // Buscar botón de WhatsApp
    const whatsappBtn = await page.$('button:has-text("WhatsApp"), button:has(svg)');
    const modalText = await page.evaluate(() => document.body.innerText);
    const hasWhatsAppText = modalText.includes('WhatsApp') || modalText.includes('Consultar');
    console.log('¿Aparece botón o texto de WhatsApp en el modal?:', hasWhatsAppText);

    // Tomar captura del modal de producto con botón de WhatsApp
    await page.screenshot({ path: '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/verified_whatsapp_product_modal.png' });
    console.log('Captura guardada: verified_whatsapp_product_modal.png');

    // Cerrar modal
    const closeBtn = await page.$('button[aria-label="Cerrar detalle"], button[aria-label="Cerrar"]');
    if (closeBtn) await closeBtn.click();
    await new Promise((r) => setTimeout(r, 800));
  }

  // 2. Probar Login con Vanessa (admin@sweethomeboutiquecr.com)
  console.log('3. Probando login con Vanessa...');
  await page.evaluate(() => {
    // Abrir modal de login mediante evento o click 5 veces en el footer
    const footerSpan = Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('Sweet Home & Boutique CR ©'));
    if (footerSpan) {
      for (let i = 0; i < 6; i++) footerSpan.click();
    }
  });

  await new Promise((r) => setTimeout(r, 1000));

  const emailInput = await page.$('input[type="email"]');
  const passInput = await page.$('input[type="password"]');
  const submitBtn = await page.$('button[type="submit"]');

  if (emailInput && passInput && submitBtn) {
    await emailInput.type('admin@sweethomeboutiquecr.com');
    await passInput.type('SweetHomeCR2026!#');
    await submitBtn.click();
    await new Promise((r) => setTimeout(r, 2000));

    const panelText = await page.evaluate(() => document.body.innerText);
    console.log('¿Aparece saludo a Vanessa?:', panelText.includes('Vanessa'));
    console.log('Texto exacto detectado en panel:', panelText.match(/Bienvenida[^\n.!]*Vanessa[^\n.!]*!/i)?.[0]);

    await page.screenshot({ path: '/home/jose/.gemini/antigravity/brain/d866b034-7654-46f9-b4fd-c132a7ff4f2a/verified_admin_vanessa.png' });
    console.log('Captura guardada: verified_admin_vanessa.png');
  }

  await browser.close();
  console.log('✅ Verificación completada con éxito.');
  process.exit(0);
})().catch((err) => {
  console.error('Error en verificación:', err);
  process.exit(1);
});
