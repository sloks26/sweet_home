# Sweet Home & Boutique CR 🇨🇷 ✨

Plataforma de E-Commerce Premium y Panel Administrativo no técnico para **Sweet Home & Boutique CR**.

> *"Donde cada detalle ilumina tu hogar y tu estilo."*

---

## 🎨 Identidad Visual y Paleta
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
```
sweet_home/
├── client/                     # Frontend (React 18, Vite, Tailwind CSS, Zustand, Framer Motion)
│   ├── public/                 # Favicon y recursos estáticos
│   ├── src/
│   │   ├── components/         # Componentes UI de diseño premium y layout
│   │   │   └── ui/             # Botones dorados, tarjetas, badges, inputs, modal, fondo de estrellas
│   │   ├── theme/              # Tokens y temas de diseño
│   │   ├── index.css           # Fuentes, utilidades de glow y degradados
│   │   ├── main.jsx            # Entry point de React
│   │   └── App.jsx             # Vista principal / enrutador
│   ├── tailwind.config.js      # Configuración con paleta exacta de la marca
│   ├── vite.config.js          # Configuración de Vite y proxy
│   └── package.json
│
├── server/                     # Backend (Node.js, Express, JavaScript ES Modules)
│   ├── src/
│   │   ├── config/             # Variables de entorno y configuración
│   │   ├── middlewares/        # Seguridad, CORS, cookies, rate limit, errores
│   │   ├── routes/             # Endpoints REST de la API
│   │   ├── controllers/        # Controladores de negocio
│   │   ├── services/           # Abstracción de almacenamiento e imágenes (Sharp)
│   │   └── index.js            # Servidor Express y entrega estática
│   ├── uploads/                # Directorio de subida local con subcarpetas
│   └── package.json
│
├── package.json                # Scripts globales del monorepo
├── .env                        # Variables de configuración local
└── README.md                   # Esta documentación
```

---

## 📦 Puesta en marcha

1. **Instalar dependencias:**
   ```bash
   npm run install:all
   ```

2. **Compilar cliente y arrancar en producción con PM2:**
   ```bash
   npm run build
   npm run pm2:start
   ```

3. **Verificación:**
   - La aplicación está disponible en el puerto 8081: `http://174.138.62.86:8081`
