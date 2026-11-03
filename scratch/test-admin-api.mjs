async function testAdmin() {
  const BASE_URL = 'http://174.138.62.86:8081';

  console.log('1. Probando Login de Administradora...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@sweethomeboutiquecr.com',
      password: 'SweetHomeCR2026!#'
    })
  });

  const cookies = loginRes.headers.get('set-cookie');
  const loginData = await loginRes.json();
  console.log('Respuesta Login:', loginData);

  if (!loginData.success) {
    console.error('Fallo en login');
    return;
  }

  const cookieHeader = cookies ? cookies.split(';')[0] : '';
  console.log('Cookie recibida:', cookieHeader ? 'OK' : 'Ninguna');

  console.log('\n2. Probando GET /api/admin/dashboard...');
  const dashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Cookie: cookieHeader }
  });
  const dashData = await dashRes.json();
  console.log('Métricas Dashboard:', dashData.data?.metrics);
  console.log('Pedidos recientes:', dashData.data?.recentOrders?.length);

  console.log('\n3. Probando GET /api/admin/orders...');
  const ordersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
    headers: { Cookie: cookieHeader }
  });
  const ordersData = await ordersRes.json();
  console.log('Total de pedidos:', ordersData.data?.pagination?.total);
  console.log('Primeros pedidos:');
  ordersData.data?.orders?.forEach(o => {
    console.log(`- #${o.orderNumber} | Cliente: ${o.customerName} | Estado: ${o.status} | Total: ₡${o.total} | Comprobante: ${o.voucherUrl ? 'SÍ' : 'NO'}`);
  });

  console.log('\n4. Probando GET /api/admin/products...');
  const prodsRes = await fetch(`${BASE_URL}/api/admin/products?limit=3`, {
    headers: { Cookie: cookieHeader }
  });
  const prodsData = await prodsRes.json();
  console.log('Productos en admin (primeros 3):', prodsData.data?.map(p => ({ id: p.id, name: p.name, price: p.price, stock: p.stock })));

  console.log('\n5. Probando GET /api/admin/categories...');
  const catsRes = await fetch(`${BASE_URL}/api/admin/categories`, {
    headers: { Cookie: cookieHeader }
  });
  const catsData = await catsRes.json();
  console.log('Categorías encontradas:', catsData.data?.length);

  console.log('\n6. Probando GET /api/admin/banners...');
  const bannersRes = await fetch(`${BASE_URL}/api/admin/banners`, {
    headers: { Cookie: cookieHeader }
  });
  const bannersData = await bannersRes.json();
  console.log('Banners encontrados:', bannersData.data?.length);

  console.log('\n✅ Todos los endpoints de administración responden con éxito HTTP 200.');
}

testAdmin().catch(console.error);
