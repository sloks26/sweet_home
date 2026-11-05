import prisma from './src/config/prisma.js';
import { createApp } from './src/server/app.js';
import jwt from 'jsonwebtoken';
import { config } from './src/config/index.js';
import fs from 'fs';
import path from 'path';

async function runTests() {
  console.log('🔒 INICIANDO BATERÍA DE PRUEBAS DE SEGURIDAD FASE 3...\n');
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASÓ: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FALLÓ: ${message}`);
      failed++;
    }
  }

  try {
    // 0. Preparar producto de prueba en BD
    const testCat = await prisma.category.findFirst({ where: { isActive: true } });
    if (!testCat) throw new Error('No hay categorías en BD para prueba');

    const testProduct = await prisma.product.upsert({
      where: { slug: 'test-vestido-seguridad-fase3' },
      update: { price: 25000, stock: 5, isActive: true },
      create: {
        name: 'Vestido de Prueba Seguridad',
        slug: 'test-vestido-seguridad-fase3',
        description: 'Producto para validar seguridad Fase 3',
        sku: 'SEC-TEST-001',
        price: 25000,
        stock: 5,
        isActive: true,
        categoryId: testCat.id
      }
    });

    // 1. PRUEBA SEC-01: Intento de manipulación de precios desde el cliente
    console.log('--- 1. Verificando SEC-01: Lógica de Precios en el Servidor ---');
    const orderPayloadHacked = {
      customerName: 'Cliente Tramposo',
      customerEmail: 'hacker@test.com',
      customerPhone: '88887777',
      shippingMethod: 'RETIRO_TIENDA',
      paymentMethod: 'SINPE_MOVIL',
      items: [
        {
          id: testProduct.id,
          name: testProduct.name,
          price: 1, // PRECIO MANIPULADO A ₡1
          quantity: 2
        }
      ]
    };

    const resOrder = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayloadHacked)
    });
    const orderData = await resOrder.json();

    assert(resOrder.status === 201, 'Orden creada exitosamente con código 201');
    assert(
      orderData.data.subtotal === 50000,
      `Subtotal calculado por servidor fidedigno: ₡${orderData.data.subtotal} (esperado: ₡50000, cliente envió: ₡2)`
    );
    assert(
      orderData.data.total === 50000,
      `Total del pedido es infalsificable: ₡${orderData.data.total}`
    );

    const createdOrderNumber = orderData.data.orderNumber;
    const createdOrderId = orderData.data.id;

    // 2. PRUEBA SEC-09: Condición de carrera / Sobreventa de stock
    console.log('\n--- 2. Verificando SEC-09: Prevención de Sobreventa de Inventario ---');
    // Quedan 3 unidades (5 - 2). Intentamos pedir 10 unidades
    const orderPayloadOverStock = {
      customerName: 'Cliente Excesivo',
      customerEmail: 'over@test.com',
      customerPhone: '88887777',
      shippingMethod: 'RETIRO_TIENDA',
      paymentMethod: 'SINPE_MOVIL',
      items: [
        {
          id: testProduct.id,
          quantity: 10 // Pide 10 cuando solo quedan 3
        }
      ]
    };

    const resOver = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayloadOverStock)
    });
    const overData = await resOver.json();

    assert(resOver.status === 400, 'Rechaza orden por falta de stock con HTTP 400');
    assert(
      overData.message.includes('Stock insuficiente'),
      `Mensaje claro de stock insuficiente: "${overData.message}"`
    );

    // 3. PRUEBA SEC-08: Consulta pública y enmascaramiento IDOR
    console.log('\n--- 3. Verificando SEC-08: Enmascaramiento de Privacidad en Rastreo ---');
    const resTracking = await fetch(`${baseUrl}/api/orders/${createdOrderNumber}`);
    const trackingData = await resTracking.json();

    assert(resTracking.status === 200, 'Consulta de rastreo exitosa con HTTP 200');
    assert(
      trackingData.data.customerName.includes('*'),
      `Nombre del cliente enmascarado: "${trackingData.data.customerName}"`
    );
    assert(
      trackingData.data.shippingAddress.includes('enmascarado') || trackingData.data.shippingAddress.includes('...'),
      `Dirección enmascarada para protección de datos: "${trackingData.data.shippingAddress}"`
    );

    // 4. PRUEBA SEC-02: Comprobantes bancarios protegidos
    console.log('\n--- 4. Verificando SEC-02: Protección de Comprobantes Bancarios ---');
    // Intento de acceso sin token admin
    const resVoucherUnauth = await fetch(`${baseUrl}/api/admin/orders/${createdOrderId}/voucher`);
    assert(
      resVoucherUnauth.status === 401,
      `Acceso sin autenticación al comprobante bloqueado con HTTP 401 Unauthorized (recibido: ${resVoucherUnauth.status})`
    );

    // Simular voucher subido
    const dummyVoucherPath = path.join(config.privateVoucherDir, `test_voucher_${Date.now()}.webp`);
    fs.writeFileSync(dummyVoucherPath, Buffer.from('RIFF....WEBPVP8 ...'));
    await prisma.order.update({
      where: { id: createdOrderId },
      data: {
        voucherUrl: `/api/admin/orders/${createdOrderId}/voucher`,
        voucherPath: dummyVoucherPath
      }
    });

    // Crear token admin válido
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN', email: 'admin@sweethomeboutiquecr.com' } });
    const adminToken = jwt.sign(
      { userId: adminUser.id, role: 'ADMIN', email: adminUser.email, tokenVersion: adminUser.tokenVersion },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const resVoucherAuth = await fetch(`${baseUrl}/api/admin/orders/${createdOrderId}/voucher`, {
      headers: { Cookie: `token=${adminToken}` }
    });
    assert(
      resVoucherAuth.status === 200,
      `Acceso con token de Administrador autorizado con HTTP 200 (recibido: ${resVoucherAuth.status})`
    );
    if (fs.existsSync(dummyVoucherPath)) fs.unlinkSync(dummyVoucherPath);

    // 5. PRUEBA SEC-10: Segregación de roles (STAFF vs ADMIN)
    console.log('\n--- 5. Verificando SEC-10: Segregación de Roles Administrativos ---');
    // Crear o buscar usuario STAFF
    let staffUser = await prisma.user.findFirst({ where: { role: 'STAFF' } });
    if (!staffUser) {
      staffUser = await prisma.user.create({
        data: {
          email: 'staff.prueba@sweethomeboutiquecr.com',
          password: 'hashedpassword123',
          name: 'Colaborador Staff',
          role: 'STAFF',
          isActive: true
        }
      });
    }

    const staffToken = jwt.sign(
      { userId: staffUser.id, role: 'STAFF', email: staffUser.email, tokenVersion: staffUser.tokenVersion },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // STAFF intenta ver contabilidad
    const resStaffAccounting = await fetch(`${baseUrl}/api/admin/accounting`, {
      headers: { Cookie: `token=${staffToken}` }
    });
    assert(
      resStaffAccounting.status === 403,
      `STAFF bloqueado para ver Finanzas/Contabilidad con HTTP 403 Forbidden (recibido: ${resStaffAccounting.status})`
    );

    // STAFF intenta borrar una orden
    const resStaffDelete = await fetch(`${baseUrl}/api/admin/orders/${createdOrderId}`, {
      method: 'DELETE',
      headers: { Cookie: `token=${staffToken}` }
    });
    assert(
      resStaffDelete.status === 403,
      `STAFF bloqueado para eliminar pedidos con HTTP 403 Forbidden (recibido: ${resStaffDelete.status})`
    );

    // ADMIN accede a contabilidad
    const resAdminAccounting = await fetch(`${baseUrl}/api/admin/accounting`, {
      headers: { Cookie: `token=${adminToken}` }
    });
    assert(
      resAdminAccounting.status === 200,
      `ADMIN accede a Finanzas/Contabilidad exitosamente con HTTP 200`
    );

    // 6. PRUEBA SEC-07: Invalidación de sesión tras logout
    console.log('\n--- 6. Verificando SEC-07: Revocación de Sesión en el Servidor (tokenVersion) ---');
    // Hacemos logout con el adminToken
    const resLogout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: `token=${adminToken}` }
    });
    assert(resLogout.status === 200, 'Logout procesado exitosamente en el servidor');

    // Intentamos reutilizar el adminToken anterior
    const resReuse = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Cookie: `token=${adminToken}` }
    });
    assert(
      resReuse.status === 401,
      `Token anterior queda matemáticamente invalidado en el servidor tras logout: HTTP 401 (recibido: ${resReuse.status})`
    );

    // Limpieza de datos de prueba
    await prisma.orderItem.deleteMany({ where: { orderId: createdOrderId } });
    await prisma.order.delete({ where: { id: createdOrderId } });
    await prisma.product.delete({ where: { id: testProduct.id } });
    if (staffUser) await prisma.user.delete({ where: { id: staffUser.id } });

    console.log(`\n========================================`);
    console.log(`RESULTADO FINAL DE PRUEBAS FASE 3:`);
    console.log(`Total Pasadas: ${passed}`);
    console.log(`Total Fallidas: ${failed}`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error fatal durante las pruebas:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests();
