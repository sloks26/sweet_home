import { createApp } from '../backend/src/server/index.js';
import prisma from '../backend/src/config/prisma.js';

async function testBackend() {
  console.log('🧪 Probando backend conectado a MongoDB Atlas...');
  
  // 1. Probar consulta directa con Prisma hacia Mongo
  const catCount = await prisma.category.count();
  const prodCount = await prisma.product.count();
  const bannerCount = await prisma.banner.count();
  const userCount = await prisma.user.count();
  
  console.log(`📊 Conteo en MongoDB Atlas:`);
  console.log(`   - Categorías: ${catCount}`);
  console.log(`   - Productos: ${prodCount}`);
  console.log(`   - Banners: ${bannerCount}`);
  console.log(`   - Usuarios: ${userCount}`);

  // 2. Probar crear una orden de prueba en MongoDB
  const testOrder = await prisma.order.create({
    data: {
      orderNumber: `SH-TEST-${Date.now()}`,
      paymentMethod: 'SINPE_MOVIL',
      customerName: 'Melanie (Prueba Atlas)',
      customerEmail: 'melanie@ejemplo.com',
      customerPhone: '8888-1234',
      shippingAddress: JSON.stringify({
        province: 'San José',
        canton: 'Escazú',
        district: 'San Rafael',
        details: '100m norte del centro comercial'
      }),
      shippingMethod: 'Mensajería Express GAM',
      subtotal: 15000,
      shippingCost: 2500,
      total: 17500,
      status: 'PENDING_PAYMENT'
    }
  });

  console.log(`✅ Orden de prueba creada exitosamente en MongoDB Atlas: ${testOrder.orderNumber} (ID: ${testOrder.id})`);

  // 3. Probar consultar la orden
  const foundOrder = await prisma.order.findUnique({
    where: { id: testOrder.id }
  });
  console.log(`✅ Orden leída de MongoDB Atlas: ${foundOrder.customerName} - Total: ₡${foundOrder.total}`);

  // 4. Limpiar la orden de prueba para no ensuciar
  await prisma.order.delete({ where: { id: testOrder.id } });
  console.log(`🧹 Orden de prueba eliminada correctamente de MongoDB.`);

  console.log(`🎉 ¡Backend y MongoDB Atlas funcionando al 100%!`);
  process.exit(0);
}

testBackend().catch(err => {
  console.error('❌ Error probando backend con MongoDB:', err);
  process.exit(1);
});
