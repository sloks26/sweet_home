async function testOrderFlow() {
  const BASE_URL = 'http://174.138.62.86:8081';

  // 1. Login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@sweethomeboutiquecr.com',
      password: 'SweetHomeCR2026!#'
    })
  });
  const cookies = loginRes.headers.get('set-cookie');
  const cookieHeader = cookies ? cookies.split(';')[0] : '';

  // 2. Obtener la orden existente
  const ordersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
    headers: { Cookie: cookieHeader }
  });
  const ordersData = await ordersRes.json();
  const order = ordersData.data?.orders?.[0];

  if (!order) {
    console.error('No se encontró orden para probar');
    return;
  }
  console.log(`Probando actualización de pedido #${order.orderNumber} (ID: ${order.id})`);

  // 3. Simular actualización a PAYMENT_CONFIRMED
  const updateRes = await fetch(`${BASE_URL}/api/admin/orders/${order.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader
    },
    body: JSON.stringify({
      status: 'PAYMENT_CONFIRMED',
      internalNotes: 'Comprobante verificado con éxito en cuenta BCR / SINPE Móvil'
    })
  });
  const updateData = await updateRes.json();
  console.log('Resultado actualización a PAYMENT_CONFIRMED:', updateData.success, updateData.data?.status);

  // 4. Simular despacho con guía Correos de Costa Rica
  const shipRes = await fetch(`${BASE_URL}/api/admin/orders/${order.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader
    },
    body: JSON.stringify({
      status: 'SHIPPED',
      trackingNumber: 'CR987654321CR'
    })
  });
  const shipData = await shipRes.json();
  console.log('Resultado despacho con número de guía:', shipData.success, shipData.data?.status, shipData.data?.trackingNumber);

  // 5. Verificar métricas del dashboard tras confirmar venta
  const dashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Cookie: cookieHeader }
  });
  const dashData = await dashRes.json();
  console.log('Nuevas métricas Dashboard (totalRevenue actualizado):', dashData.data?.metrics);
}

testOrderFlow().catch(console.error);
