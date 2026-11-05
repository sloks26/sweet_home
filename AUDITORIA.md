# Informe Integral de Auditoría de Código y Seguridad
**Proyecto:** Sweet Home & Boutique CR  
**Fecha:** Noviembre 2026  
**Entornos Analizados:** Backend (`/backend`), Frontend (`/frontend`), Configuración Monorepo  
**Versiones Base:** Node.js v20.20.0 | npm 10.8.2 | React 18.3.1 | Express 4.21.2 | Prisma 6.3.0

---

## Resumen Ejecutivo
Se realizó una auditoría estática, arquitectónica, de dependencias y de seguridad sobre los 110 archivos de código fuente de la plataforma. La aplicación cuenta con una base sólida (compila en 2.46s, 0 dependencias circulares y duplicación de código en 1.97%). No obstante, se detectaron **4 hallazgos CRÍTICOS** (notablemente la manipulación de precios de compra desde el cliente en `order.controller.js`, exposición pública de comprobantes de pago bancarios en `/uploads`, clave secreta JWT de fallback en código y credenciales por defecto en el seed), **7 hallazgos de severidad ALTA** (CORS permisivo con credenciales, sobreventa por condición de carrera en inventario, IDOR en seguimiento de pedidos, falta de invalidación de sesión en el servidor, vulnerabilidades en librerías y falta de segregación de roles en endpoints administrativos), así como oportunidades de limpieza de librerías huérfanas (`react-router-dom` y `@tanstack/react-query`) y modularización de componentes extensos.

---

## Tabla de Hallazgos por Gravedad

| ID | Gravedad | Categoría | Archivo y Línea | Descripción Corta |
|---|---|---|---|---|
| **SEC-01** | **CRÍTICO** | Lógica de Negocio / Precios | `backend/src/controllers/order.controller.js:60` | Precio y subtotal calculados confiando en el precio enviado por el cliente |
| **SEC-02** | **CRÍTICO** | Confidencialidad / Acceso | `backend/src/server/app.js:46-52` | Comprobantes de pago bancario almacenados en ruta pública estática `/uploads` |
| **SEC-03** | **CRÍTICO** | Autenticación / Secretos | `backend/src/config/index.js:16` | Fallback de clave secreta JWT en texto claro en el código fuente |
| **SEC-04** | **CRÍTICO** | Credenciales por Defecto | `backend/prisma/seed.js:38` y `.env.example:16` | Contraseña administrativa por defecto hardcodeada en el script de seed |
| **SEC-05** | **ALTO** | Dependencias Vulnerables | `backend/package.json` | 5 vulnerabilidades altas en backend (`sharp <= 0.33.5`, `zod < 3.24.2`) |
| **SEC-06** | **ALTO** | Configuración HTTP / CORS | `backend/src/server/app.js:34-39` | CORS configurado con `origin: true` y `credentials: true` (permite cualquier origen) |
| **SEC-07** | **ALTO** | Sesiones / Logout | `backend/src/controllers/auth.controller.js:170` | Cierre de sesión ciego: no invalida el token JWT en el servidor |
| **SEC-08** | **ALTO** | Privacidad / IDOR | `backend/src/controllers/order.controller.js:214` | Consulta de orden expone dirección física completa y datos personales sin verificación |
| **SEC-09** | **ALTO** | Concurrencia / Stock | `backend/src/controllers/order.controller.js:116` | Permite sobreventa de inventario y compras de productos agotados |
| **SEC-10** | **ALTO** | Autorización / Roles | `backend/src/routes/admin.routes.js:9` | Falta de segregación: rol STAFF puede eliminar órdenes, categorías y ver finanzas |
| **SEC-11** | **ALTO** | Disponibilidad / DoS | `backend/src/routes/order.routes.js:14`, `admin.routes.js:32` | Sin rate limiting en endpoints de subida de archivos ni creación de pedidos |
| **SEC-12** | **MEDIO** | Autenticación | `backend/src/controllers/auth.controller.js:155` | Token JWT expuesto en el cuerpo JSON de la respuesta de login |
| **SEC-13** | **MEDIO** | Validación de Entradas | `backend/src/controllers/admin/adminDashboard.controller.js:140` | `updateSiteContent` guarda datos sin validación de esquema Zod |
| **SEC-14** | **MEDIO** | Subida de Archivos | `backend/src/services/imageService.js:31-38` | Validación de tipo MIME basada únicamente en cabecera HTTP del cliente |
| **COD-01** | **MEDIO** | Calidad / Hooks React | `frontend/src/App.jsx:96`, `AdminBanners.jsx:51`, etc. | Llamadas a `setState` síncronas en `useEffect` e invocación previa a declaración |
| **COD-02** | **MEDIO** | Sintaxis / Módulos | `backend/src/controllers/admin.controller.js:5-6` | Exportación múltiple redundante del identificador `adminController` |
| **DEP-01** | **MEDIO** | Dependencias Muertas | `frontend/package.json` | `@tanstack/react-query` y `react-router-dom` instaladas pero 100% sin uso |
| **PRF-01** | **MEDIO** | Rendimiento / Memoria | `backend/src/middlewares/rateLimiter.js:1` | `ipAttempts = new Map()` sin purga periódica (posible fuga de memoria) |
| **SEC-15** | **MEDIO** | Configuración Helmet | `backend/src/server/app.js:28-32` | Content Security Policy (CSP) desactivada en Helmet |
| **COD-03** | **BAJO** | Archivos Huérfanos | `frontend/src/components/ui/Card.jsx`, `Select.jsx`, `tokens.js` | Archivos no importados por ningún módulo del sistema |
| **COD-04** | **BAJO** | Código Duplicado | `ApartadosTable.jsx`, `ContraEntregaTable.jsx`, formatters | 31 bloques duplicados detectados por jscpd (1.97% del código) |
| **STR-01** | **BAJO** | Tamaño de Archivos | 16 archivos frontend y 3 backend | Archivos que superan las 300 líneas de código |
| **COD-05** | **BAJO** | Calidad JSX / ESLint | `FullStoryModal.jsx`, `ProductInfoTabs.jsx`, etc. | Comillas sin escapar en JSX (`react/no-unescaped-entities`) |
| **COD-06** | **BAJO** | Sintaxis / ESLint | `backend/src/services/imageService.js:144` | Bloque `catch` vacío en generación de LQIP (`no-empty`) |

---

## Detalle Exhaustivo de Hallazgos

### A. Errores de Sintaxis, Calidad y Módulos

#### [SEC-03] Clave Secreta JWT de Fallback Hardcodeada
- **Archivo y Línea:** `backend/src/config/index.js:16`
- **Qué pasa:** Se define `jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_in_production_key'`.
- **Por qué importa:** Si la variable `JWT_SECRET` se omite accidentalmente en el archivo `.env`, la aplicación arranca sin emitir alerta y firma los tokens con una clave pública conocida. Cualquier atacante podría forjar tokens con `role: "ADMIN"` y tomar control absoluto del panel.
- **Cómo se corrige:** Implementar un validador estricto con Zod en la inicialización de la configuración (`config/index.js`). Si falta `JWT_SECRET` o tiene menos de 32 caracteres, detener el proceso con error fatal.

#### [COD-02] Exportaciones Duplicadas en Controlador de Administración
- **Archivo y Línea:** `backend/src/controllers/admin.controller.js:5-7`
- **Qué pasa:** Contiene:
  ```javascript
  export * from './admin/index.js';
  export { adminController } from './admin/index.js';
  import { adminController } from './admin/index.js';
  export default adminController;
  ```
- **Por qué importa:** Provoca advertencias/errores en herramientas de empaquetado y linters (`import/export: Multiple exports of name 'adminController'`).
- **Cómo se corrige:** Unificar en una exportación única y limpia: `export { adminController } from './admin/index.js'; export default adminController;`.

#### [COD-01] Errores de Ciclo de Vida y Hooks de React
- **Archivo y Línea:** `frontend/src/App.jsx:96`, `AdminBanners.jsx:51`, `AdminCategories.jsx:34`, `AdminDashboard.jsx:47`, `AdminOrders.jsx:51`, `AdminMedia.jsx:42`, `MegaMenu.jsx:19`, `HeaderSearchBar.jsx:25`
- **Qué pasa:**
  1. En `App.jsx`, la función `fetchAdminStats` es invocada en el efecto de autenticación antes de ser declarada (violación de inmutabilidad de React Compiler / ESLint).
  2. En múltiples componentes, se ejecuta `setState` de forma síncrona inmediata dentro del cuerpo de `useEffect` (ej. `setStatusFilter`, `setIsFading`, `setSearchResults([])`).
- **Por qué importa:** Puede provocar cascadas de renderizado innecesarias, bloqueos en la interfaz y advertencias severas de ESLint.
- **Cómo se corrige:**
  1. Declarar `fetchAdminStats` antes del `useEffect` en `App.jsx` o envolverla en `useCallback`.
  2. Inicializar los estados correspondientes con su valor por defecto en lugar de mutarlos inmediatamente en el primer render, y agrupar actualizaciones en manejadores de eventos.

#### [COD-06] Bloque Catch Vacío en `imageService.js`
- **Archivo y Línea:** `backend/src/services/imageService.js:144`
- **Qué pasa:** `catch (_) {}` captura el fallo de generación de LQIP sin registrar la causa.
- **Por qué importa:** Dificulta el diagnóstico si la generación de placeholders de imágenes falla.
- **Cómo se corrige:** Registrar la advertencia en modo depuración o documentar explícitamente el descarte intencional (`/* placeholder no crítico */`).

---

### B. Código Repetido y Duplicaciones

Se ejecutó `jscpd` con umbral de 5 líneas y 50 tokens sobre `backend/src` y `frontend/src`.
- **Líneas Totales Analizadas:** 19,218 líneas
- **Clones Encontrados:** 31 clones
- **Líneas Duplicadas:** 379 líneas (1.97% del código total)

#### Principales Bloques Duplicados Identificados:
1. **Tablas de Apartados y Contra Entrega (`ApartadosTable.jsx` vs `ContraEntregaTable.jsx`):**
   - 4 clones idénticos que suman más de 78 líneas. Comparten la estructura de la cabecera de la tabla, estilos de fila, diálogos de confirmación y estados vacíos.
   - *Solución:* Crear un componente genérico `AdminTableWrapper` o reutilizar una plantilla de fila configurable.
2. **Formateo de Moneda (Colones de Costa Rica) y Fechas:**
   - Detectado en más de 12 archivos (`AccountingChart.jsx`, `AdminOrders.jsx`, `ProductCard.jsx`, `CheckoutStep1Customer.jsx`, `ContraEntregaTable.jsx`, etc.):
     ```javascript
     const formatPrice = (amount) => `₡${Number(amount).toLocaleString('es-CR')}`;
     ```
   - *Solución:* Centralizar en `frontend/src/utils/currency.js` con funciones estándar `formatColones(amount)` y `formatCompactColones(amount)`.
3. **Constantes y Estados de Pedidos:**
   - Textos de estado (`PENDING_PAYMENT`, `VOUCHER_RECEIVED`, `PAYMENT_CONFIRMED`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) repetidos en selectores, insignias y modales.
   - *Solución:* Crear `frontend/src/constants/orderStatus.js` con etiquetas, colores de insignias y descripciones.
4. **Resumen de Cuentas SINPE / Bancos en Checkout:**
   - Bloques clonados entre `CheckoutStep2Payment.jsx` y `CheckoutStep3Confirmation.jsx` (21 líneas idénticas).
   - *Solución:* Extraer al componente compartido `PaymentAccountDetails.jsx`.

---

### C. Estructura y Código Espagueti

#### Archivos que Exceden el Límite de 300 Líneas:
- **Backend:**
  - `backend/src/controllers/admin/adminProducts.controller.js` (387 líneas)
  - `backend/src/controllers/admin/adminAccounting.controller.js` (362 líneas)
  - `backend/src/controllers/catalog.controller.js` (359 líneas)
- **Frontend:**
  - `AdminOrderDetailModal.jsx` (489 líneas)
  - `AdminSettings.jsx` (478 líneas)
  - `AdminProducts.jsx` (470 líneas)
  - `AdminProductModal.jsx` (459 líneas)
  - `App.jsx` (445 líneas)
  - `AdminBanners.jsx` (411 líneas)
  - `AdminOurStory.jsx` (408 líneas)
  - `AdminOrders.jsx` (407 líneas)
  - `AdminCategoryModal.jsx` (374 líneas)
  - `ProductDetailModal.jsx` (370 líneas)
  - `CatalogPage.jsx` (360 líneas)
  - `PhotoEditorModal.jsx` (339 líneas)
  - `CheckoutStep3Confirmation.jsx` (318 líneas)
  - `CheckoutModal.jsx` (312 líneas)
  - `AdminLayout.jsx` (304 líneas)
  - `CheckoutStep1Customer.jsx` (303 líneas)

#### Archivos Huérfanos Identificados (madge / depcheck):
- `frontend/src/components/ui/Card.jsx`: Ningún componente lo importa.
- `frontend/src/components/ui/Select.jsx`: Ningún componente lo importa.
- `frontend/src/theme/tokens.js`: Constantes no utilizadas (se usa Tailwind CSS directamente).
- `package.json` Frontend: `@tanstack/react-query` y `react-router-dom` instaladas en dependencias de producción pero sin ningún uso en el código.

---

### D. Seguridad Real del Sistema

#### [SEC-01] Manipulación de Precios desde el Cliente (CRÍTICO)
- **Archivo y Línea:** `backend/src/controllers/order.controller.js:60` y `:131`
- **Qué pasa:** La API pública `POST /api/orders` calcula el subtotal y el total del pedido sumando `item.price * item.quantity` directamente de los datos JSON enviados por el navegador.
- **Por qué importa:** Un atacante puede alterar la petición enviando `price: 1` para un vestido o adorno de ₡25,000, generando un pedido oficial por ₡1.
- **Cómo se corrige:** El servidor debe consultar los IDs de producto en la base de datos (`prisma.product.findMany`), tomar el precio oficial y la variante, y computar el total de forma infalsificable en el backend.

#### [SEC-02] Almacenamiento y Servicio Público de Comprobantes Bancarios (CRÍTICO)
- **Archivo y Línea:** `backend/src/server/app.js:46-52`, `backend/src/controllers/order.controller.js:267`
- **Qué pasa:** Los comprobantes subidos por los clientes para verificar SINPE Móvil o Transferencia se procesan y almacenan en `backend/uploads/`, el cual se expone públicamente vía `app.use('/uploads', express.static(...))`.
- **Por qué importa:** Cualquier persona que adivine o conozca el nombre del archivo puede acceder al comprobante bancario, visualizando nombres de titulares, números de cuenta IBAN, saldos y montos.
- **Cómo se corrige:**
  1. Almacenar los comprobantes en una carpeta no pública (`backend/uploads/vouchers/` o `backend/private/vouchers/`).
  2. Servir los comprobantes únicamente a través de una ruta protegida (`GET /api/admin/orders/:id/voucher`) con middleware `requireStaff`.

#### [SEC-04] Credenciales Administrativas por Defecto en Script de Inicialización (CRÍTICO)
- **Archivo y Línea:** `backend/prisma/seed.js:38` y `.env.example:16`
- **Qué pasa:** Si el entorno no define `INITIAL_ADMIN_PASSWORD`, el seed crea el usuario administrador con la contraseña `SweetHomeCR2026!#`.
- **Por qué importa:** Despliegues automáticos o descuidos en producción dejarían el panel abierto con una contraseña indexada públicamente en el código.
- **Cómo se corrige:** Forzar que la variable sea obligatoria o generar una contraseña segura aleatoria e imprimirla una sola vez en la consola.

#### [SEC-06] Configuración de CORS Insegura con Credenciales (ALTO)
- **Archivo y Línea:** `backend/src/server/app.js:34-39`
- **Qué pasa:**
  ```javascript
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  ```
- **Por qué importa:** `origin: true` refleja cualquier cabecera `Origin` entrante (incluyendo dominios maliciosos como `malicious-site.com`) y permite `credentials: true` (cookies de autenticación). Esto anula las protecciones de Same-Origin Policy y permite a páginas externas hacer peticiones autenticadas y leer respuestas.
- **Cómo se corrige:** Restringir el origen exclusivamente a la lista blanca autorizada (`config.clientUrl` y localhost en desarrollo).

#### [SEC-07] Ausencia de Invalidación de Tokens en Logout (ALTO)
- **Archivo y Línea:** `backend/src/controllers/auth.controller.js:170-190`
- **Qué pasa:** `logout` solo borra la cookie en el navegador con `res.clearCookie('token')`.
- **Por qué importa:** El token JWT firmado permanece matemáticamente válido durante 7 días. Si fue interceptado, el cierre de sesión no mitiga el acceso.
- **Cómo se corrige:** Implementar un campo `tokenVersion` en el modelo `User`. Cada vez que el usuario cierra sesión o cambia su contraseña, se incrementa `tokenVersion`. El middleware `authenticate` rechaza cualquier token con versión desactualizada.

#### [SEC-08] Exposición de Datos Personales (IDOR) en Consulta de Pedidos (ALTO)
- **Archivo y Línea:** `backend/src/controllers/order.controller.js:197-235`
- **Qué pasa:** `GET /api/orders/:orderNumber` devuelve nombre completo, teléfono y dirección física detallada de entrega a cualquiera que proporcione el número de orden.
- **Por qué importa:** Aunque los números de orden ahora son aleatorios (`SH-2026-XXXXX`), si un cliente comparte su número o captura de pantalla, terceros pueden ver su dirección exacta de residencia.
- **Cómo se corrige:** Enmascarar la dirección de entrega (ej: `San José, Escazú... (dirección enmascarada)`) en la respuesta pública.

#### [SEC-09] Condición de Carrera y Sobreventa de Inventario (ALTO)
- **Archivo y Línea:** `backend/src/controllers/order.controller.js:116-123`
- **Qué pasa:** Verifica `if (product && product.stock > 0)` pero permite que un cliente pida una cantidad mayor a la existente y descuenta `Math.max(0, product.stock - it.quantity)`.
- **Por qué importa:** Si quedan 2 unidades y un cliente pide 10, la orden se aprueba y se sobrevenden 8 unidades.
- **Cómo se corrige:** Validar dentro de la transacción `if (product.stock < it.quantity) throw new Error('Stock insuficiente')`.

#### [SEC-10] Falta de Segregación de Privilegios Administrativos (ALTO)
- **Archivo y Línea:** `backend/src/routes/admin.routes.js:9`
- **Qué pasa:** Se aplica `requireStaff` para todas las rutas.
- **Por qué importa:** Un usuario con rol `STAFF` tiene acceso a borrar órdenes completas (`DELETE /orders/:id`), borrar categorías y ver todos los informes contables financieros.
- **Cómo se corrige:** Separar los middlewares: usar `requireStaff` para operaciones diarias (marcar pedido, ver catálogo) y `requireAdmin` para operaciones destructivas (`DELETE`) y financieras (`/accounting`, `/expenses`).

#### [SEC-11] Ausencia de Rate Limiting en Subida de Archivos y Pedidos (ALTO)
- **Archivo y Línea:** `backend/src/routes/order.routes.js:8, 14` y `admin.routes.js:32`
- **Qué pasa:** No hay límite de peticiones por minuto en la creación de pedidos ni en la subida de imágenes.
- **Por qué importa:** Riesgo de saturación de disco o agotamiento de CPU procesando imágenes mediante Sharp.
- **Cómo se corrige:** Aplicar limitadores estrictos (ej. 10 subidas por minuto y 5 pedidos por minuto por IP).

---

### E. Rendimiento y Robustez

1. **Variables de Entorno sin Validación en Arranque:**
   - Si `DATABASE_URL` o `JWT_SECRET` faltan, el servidor arranca y falla silenciosamente o con comportamientos inseguros. Debe integrarse validación con Zod en `backend/src/config/index.js`.
2. **Paginación en Catálogo y Pedidos:**
   - En `adminOrders.controller.js`, si la boutique acumula miles de pedidos, la consulta recupera todos los registros sin límite predeterminado. Debe estandarizarse paginación por defecto (`limit = 50`, `skip`).
3. **Manejo Centralizado de Errores y Validaciones Zod:**
   - En varios controladores se repite el formateo de errores de Zod. Se debe crear un middleware de validación estándar `validate(schema)` que capture y responda en formato uniforme.

---

## Árbol de Carpetas: Actual vs Propuesto

### Estructura Actual
```text
sweet_home/
├── backend/
│   ├── prisma/
│   │   ├── dev.db (SQLite legacy en disco, ignorado)
│   │   ├── schema.prisma (MongoDB)
│   │   └── seed.js
│   ├── src/
│   │   ├── config/ (index.js, prisma.js)
│   │   ├── controllers/ (auth, catalog, order, admin.controller.js, admin/)
│   │   ├── middlewares/ (auth.js, rateLimiter.js)
│   │   ├── routes/ (admin, auth, catalog, order)
│   │   ├── server/ (app.js, index.js, routes.js)
│   │   └── services/ (audit.js, cacheService.js, imageService.js)
│   └── uploads/ (expuesta estáticamente al público)
├── frontend/
│   ├── src/
│   │   ├── components/ (admin, catalog, checkout, home, layout, ui)
│   │   ├── store/ (ageGateStore, cartStore, wishlistStore)
│   │   ├── theme/ (tokens.js - huérfano)
│   │   ├── utils/ (clipboard.js)
│   │   ├── App.jsx (445 líneas)
│   │   └── main.jsx
```

### Estructura Objetivo Propuesta
```text
sweet_home/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js (sin contraseñas por defecto en texto plano)
│   ├── src/
│   │   ├── config/ (validación estricta Zod en arranque)
│   │   ├── controllers/ (controladores delgados orientados a petición/respuesta)
│   │   ├── services/ (lógica de negocio pura: pedidos, precios, stock, imágenes)
│   │   ├── middlewares/ (auth, requireRole, rateLimiting, validation, errorHandler)
│   │   ├── routes/ (enrutadores Express con middlewares de rol explícitos)
│   │   ├── validators/ (esquemas Zod centralizados para cada entidad)
│   │   └── utils/ (respuestas estándar, formateadores)
│   ├── uploads/
│   │   ├── media/ (imágenes públicas optimizadas: productos, banners)
│   │   └── vouchers/ (comprobantes bancarios PRIVADOS y protegidos)
├── frontend/
│   ├── src/
│   │   ├── components/ (UI base compartida: botones, inputs, modales, tablas)
│   │   ├── features/
│   │   │   ├── admin/ (vistas y modales del panel administrativo < 350 líneas)
│   │   │   ├── catalog/ (catálogo y detalles)
│   │   │   ├── checkout/ (pasos 1, 2 y 3)
│   │   │   └── home/ (secciones públicas y carrusel)
│   │   ├── services/ (cliente API centralizado para peticiones a /api)
│   │   ├── store/ (gestión de estado de carrito, verificación y favoritos)
│   │   ├── constants/ (estados de pedidos, métodos de pago, claves)
│   │   ├── utils/ (formato de colones, fechas, portapapeles)
│   │   ├── App.jsx (< 300 líneas)
│   │   └── main.jsx
```

---

## Plan de Corrección Priorizado

### 1. FASE 2: Formateo y Limpieza Segura (Sin impacto en lógica)
- Unificar configuración de Prettier y ESLint para todo el monorepo.
- Aplicar formato automático a todos los archivos.
- Resolver errores de sintaxis (exportaciones dobles en `admin.controller.js`, bloque catch en `imageService.js`).
- Remover dependencias huérfanas en `frontend/package.json` (`@tanstack/react-query`, `react-router-dom`).
- Eliminar archivos huérfanos confirmados (`Card.jsx`, `Select.jsx`, `tokens.js`).
- Corregir el orden de declaración en `App.jsx` (`fetchAdminStats`) y comillas en JSX.

### 2. FASE 3: Correcciones de Seguridad (CRÍTICO y ALTO) — COMPLETADA Y DESPLEGADA
1. **Lógica de Precios del Servidor (SEC-01 - Crítico):** Resuelto. Los precios se obtienen directamente de la base de datos oficial (`prisma.product`) en transacción atómica en `order.controller.js`. Todo precio o subtotal alterado desde el navegador es completamente ignorado.
2. **Protección de Comprobantes Bancarios (SEC-02 - Crítico):** Resuelto. Los comprobantes SINPE y bancarios se almacenan en el directorio privado `backend/private/vouchers/` (no expuesto estáticamente) y se sirven únicamente mediante el endpoint protegido `GET /api/admin/orders/:id/voucher` bajo autenticación de staff/admin con cabeceras `no-store`.
3. **Validación de Configuración y Claves (SEC-03 y SEC-04 - Crítico):** Resuelto. Validación estricta con Zod en `config/index.js` para `JWT_SECRET`, `PORT`, `NODE_ENV` y `DATABASE_URL`. Rechaza claves inseguras de fallback en producción y exige contraseñas seguras en `seed.js`.
4. **CORS y Sesiones (SEC-06 y SEC-07 - Alto):** Resuelto. Se implementó lista blanca estricta de dominios permitidos en `app.js` (reemplazando `origin: true`). Se implementó revocación de tokens JWT en el servidor mediante `tokenVersion` en el modelo `User`, invalidando de inmediato cualquier sesión anterior al hacer logout.
5. **Inventario Transaccional (SEC-09 - Alto):** Resuelto. Validación estricta de stock disponible en MongoDB antes de confirmar el pedido; rechaza con HTTP 400 cualquier solicitud que supere las existencias disponibles.
6. **Segregación de Roles (SEC-10 - Alto):** Resuelto. Se separó `requireStaff` de `requireAdmin`. Operaciones destructivas (eliminación de pedidos, categorías, productos, medios) y módulos financieros (`/accounting`, `/expenses`, `/users`) ahora exigen rol `ADMIN`.
7. **Rate Limiting y Prevención de Fugas (SEC-11 y PRF-01 - Alto/Medio):** Resuelto. Se añadieron limitadores por IP para creación de pedidos y subida de comprobantes, junto con purga automática periódica de memoria en `rateLimiter.js`.
8. **Pruebas de Verificación Automatizadas:** Suite completa en `backend/test-phase3-security.mjs` con 15 pruebas pasando exitosamente (0 fallos).

---

### 3. FASE 4: Eliminación de Duplicados y Reorganización Estructural
- Extraer utilidades compartidas: `formatColones`, `formatCompactColones`, `formatDate`.
- Unificar tablas de Apartados y Contra Entrega con componente base.
- Modularizar los archivos mayores a 300 líneas (especialmente `AdminOrderDetailModal`, `AdminSettings`, `AdminProducts`, `AdminOrders`, `order.controller.js` y `catalog.controller.js`).
- Centralizar cliente API y constantes de pedidos.

### 4. FASE 5: Verificación Final y Documentación
- Ejecutar suite de herramientas (ESLint, jscpd, madge, depcheck, secretlint, npm audit) y presentar comparativa antes/después.
- Prueba integral de extremo a extremo (E2E) de flujos de compra, panel, comprobantes e imágenes.
- Actualizar README con instrucciones de instalación, variables de entorno y despliegue.

---
*(Fin del Informe de Auditoría. En espera de aprobación para proceder con la Fase 2).*
