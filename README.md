# Sweet Home & Boutique CR 🇨🇷 ✨

Plataforma integral de E-Commerce de Lujo, Gestión Contable/ERP y CRM para **Sweet Home & Boutique CR**.

> *"Donde cada detalle ilumina tu hogar y tu estilo."*

---

## 🌐 Enlaces del Sistema en Producción

- **Tienda Oficial en Línea (Dominio Seguro SSL):** [https://sweethomeandboutiquecr.com/](https://sweethomeandboutiquecr.com/)
- **Acceso con www:** [https://www.sweethomeandboutiquecr.com/](https://www.sweethomeandboutiquecr.com/)
- **Documento de Auditoría y Certificación:** [`AUDITORIA.md`](./AUDITORIA.md)

---

## 🎨 Identidad Visual y Paleta de Diseño
- **Fondo noche profundo:** `#12071F` (night-900), `#1B0B30` (night-800), `#2A1148` (night-700 / tarjetas)
- **Púrpura galaxia:** `#5B21B6` / `#7C3AED`
- **Magenta / rosa nebulosa:** `#C026D3`, `#E0559F`, `#F472B6`
- **Dorado metálico:** `#D4A017`, `#F2C14E`, `#FFE08A` con degradado cálido
- **Tipografías:**
  - Script elegante: `Great Vibes`
  - Serif refinada: `Cormorant Garamond`
  - Sans-serif limpia: `Inter`

---

## 🚀 Arquitectura del Monorepo

```text
sweet_home/
├── frontend/                   # Frontend SPA (React 18, Vite 6, Tailwind CSS, Zustand, Framer Motion)
│   ├── public/                 # Favicon, assets estáticos y dossier ejecutivo
│   ├── src/
│   │   ├── components/         # Componentes modulares (< 500 líneas por archivo)
│   │   │   ├── admin/          # Panel administrativo de lujo, dashboard, órdenes, productos, finanzas
│   │   │   ├── catalog/        # Catálogo interactivo, filtros dinámicos, modal de detalle de producto
│   │   │   ├── checkout/       # Checkout 3 pasos (datos, SINPE/efectivo/banco, confirmación con comprobante)
│   │   │   ├── home/           # Portada, hero carrusel, historia de marca, testimonios
│   │   │   ├── layout/         # Header de lujo, mega-menú, barra de categorías, footer, rastreo público
│   │   │   └── ui/             # Botones de oro, tarjetas glow, modales e inputs accesibles
│   │   ├── constants/          # Estados de pedidos y métodos de pago centralizados (orderStatus.js)
│   │   ├── store/              # Stores globales de Zustand (cartStore, ageGateStore, wishlistStore)
│   │   ├── utils/              # Formateo centralizado de colones (₡) y fechas (currency.js, clipboard.js)
│   │   ├── index.css           # Estilos globales, gradientes y animaciones
│   │   ├── main.jsx            # Punto de entrada React
│   │   └── App.jsx             # Vista raíz y orquestador (< 500 líneas)
│   ├── tailwind.config.js      # Configuración de diseño con paleta exacta de la boutique
│   ├── vite.config.js          # Configuración de compilación Vite optimizada en 27 chunks
│   └── package.json
│
├── backend/                    # Backend API (Node.js, Express, JavaScript ES Modules, Prisma 6)
│   ├── prisma/
│   │   ├── schema.prisma       # Modelado de datos en MongoDB Atlas / Local con tokenVersion y voucherPath
│   │   └── seed.js             # Inicialización segura con verificación de contraseña obligatoria
│   ├── src/
│   │   ├── config/             # Validación estricta con Zod en arranque (index.js, prisma.js)
│   │   ├── controllers/        # Controladores desacoplados de negocio (< 400 líneas)
│   │   │   ├── admin/          # Controladores administrativos (órdenes, productos, finanzas, usuarios, banners)
│   │   │   ├── auth.controller.js     # Autenticación JWT con tokenVersion y revocación en servidor
│   │   │   ├── catalog.controller.js  # Catálogo público, categorías y productos activos
│   │   │   └── order.controller.js    # Pedidos con cálculo infalsificable de precios y stock transaccional
│   │   ├── middlewares/        # Autenticación (requireAdmin vs requireStaff), rateLimiters, seguridad
│   │   ├── routes/             # Enrutadores Express (admin, auth, catalog, order)
│   │   ├── server/             # Configuración de Express, CORS whitelist, Helmet y servidor estático
│   │   └── services/           # Optimización de imágenes (Sharp), auditoría y caché
│   ├── private/
│   │   └── vouchers/           # Almacenamiento PRIVADO de comprobantes bancarios (fuera de /uploads)
│   ├── uploads/                # Imágenes públicas de productos y banners
│   ├── test-phase3-security.mjs # Batería automatizada de 15 pruebas de seguridad de backend
│   └── package.json
│
├── scripts/
│   └── deploy-vps.sh           # Script automatizado de compilación y despliegue a VPS con PM2
├── AUDITORIA.md                # Informe exhaustivo de auditoría y certificación de seguridad
├── package.json                # Scripts globales del monorepo
└── README.md                   # Esta documentación
```

---

## 🔒 Seguridad Implementada (Certificación Post-Auditoría)

1. **Cálculo Infalsificable de Precios en el Servidor (SEC-01):** Todo subtotal y total de compra se calcula directamente desde los precios vigentes de la base de datos dentro de una transacción atómica; cualquier manipulación de precio desde el navegador es rechazada.
2. **Protección de Comprobantes Bancarios (SEC-02):** Los comprobantes de transferencia y SINPE Móvil se guardan en un directorio privado inaccesible para la web pública (`backend/private/vouchers/`) y se sirven exclusivamente mediante el endpoint autenticado `GET /api/admin/orders/:id/voucher` para el personal autorizado.
3. **Validación de Configuración con Zod (SEC-03 & SEC-04):** El backend no arranca si faltan variables críticas de entorno o si la clave secreta JWT es insegura.
4. **CORS con Lista Blanca Estricta (SEC-06):** Solo los orígenes autorizados pueden comunicarse con la API mediante cookies seguras `HttpOnly`.
5. **Revocación de Sesiones en el Servidor (SEC-07):** El modelo de usuario incluye `tokenVersion`. Al cerrar sesión o cambiar credenciales, el token queda invalidado de inmediato en el backend.
6. **Enmascaramiento de Privacidad en Rastreo (SEC-08):** El endpoint público de seguimiento de pedidos enmascara los nombres y direcciones de entrega para proteger los datos de los clientes.
7. **Control Transaccional de Stock (SEC-09):** Validación en MongoDB que previene la sobreventa y carreras concurrentes de pedidos.
8. **Segregación de Roles (SEC-10):** El rol `STAFF` solo puede gestionar pedidos y catálogo; las acciones financieras (`/accounting`, `/expenses`) y las eliminaciones (`DELETE`) exigen estrictamente rol `ADMIN`.
9. **Mitigación DoS y Rate Limiting (SEC-11):** Limitadores de peticiones por IP en subida de comprobantes y creación de pedidos, con purga automática de memoria.

---

## 📊 Calidad de Código y Métricas de Auditoría

- **Archivos > 500 Líneas:** **0 archivos** en todo el monorepo (cumplimiento 100% de la Regla de Oro).
- **Dependencias Circulares:** **0 dependencias circulares** en 119 archivos analizados con `madge`.
- **Errores de Linting:** **0 errores de ESLint** en todo el monorepo.
- **Duplicación de Código:** **1.95%** analizado con `jscpd` (dentro de márgenes de excelencia técnica).
- **Pruebas Automatizadas de Seguridad:** **15 de 15 pruebas pasadas (100%)** en `test-phase3-security.mjs`.
- **Tiempo de Compilación:** **2.43s** con Vite generando 27 chunks optimizados.

---

## 📦 Puesta en Marcha Local

### 1. Requisitos Previos
- Node.js >= 20.x
- MongoDB (local o Atlas)
- npm >= 10.x

### 2. Instalación de Dependencias
```bash
npm run install:all
```

### 3. Configuración de Variables de Entorno
Crear `backend/.env` con:
```env
PORT=8081
NODE_ENV=development
DATABASE_URL="mongodb://localhost:27017/sweet_home_dev"
JWT_SECRET="clave_secreta_de_al_menos_32_caracteres_super_segura"
CLIENT_URL="http://localhost:5173"
INITIAL_ADMIN_PASSWORD="TuContraseñaSegura123!"
```

### 4. Inicializar Base de Datos y Semillas
```bash
npx --prefix backend prisma db push
npm run seed
```

### 5. Iniciar en Desarrollo
```bash
npm run dev
```

---

## 🚀 Despliegue en Producción (VPS)

El proyecto cuenta con un script de despliegue continuo automatizado:

```bash
bash scripts/deploy-vps.sh
```

El script se encarga de:
1. Verificar estado de Git en local.
2. Transferir los cambios al VPS en `174.138.62.86`.
3. Instalar dependencias en servidor.
4. Aplicar cambios de esquema en Prisma MongoDB (`prisma db push`).
5. Compilar el frontend optimizado con Vite (`npm run build`).
6. Reiniciar o recargar el proceso PM2 id 30 (`sweet-home-8081`).
7. Comprobar que el endpoint HTTP responde con código `200 OK`.
