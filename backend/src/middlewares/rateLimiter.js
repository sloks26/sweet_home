const ipAttempts = new Map();

// Purgado periódico cada 5 minutos para prevenir fuga de memoria (PRF-01)
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipAttempts.entries()) {
    if (now > record.resetTime) {
      ipAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Limitador genérico de intentos por IP para proteger endpoints críticos contra abuso
 * @param {Object} options
 * @param {number} options.maxAttempts - Intentos máximos permitidos en la ventana
 * @param {number} options.windowMs - Duración de la ventana en milisegundos
 * @param {string} options.message - Mensaje retornado al exceder
 */
export function rateLimiter({
  maxAttempts = 10,
  windowMs = 15 * 60 * 1000,
  message = 'Demasiados intentos. Intenta de nuevo más tarde.'
} = {}) {
  return (req, res, next) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const clientIp = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
    const now = Date.now();

    const record = ipAttempts.get(clientIp);

    if (!record || now > record.resetTime) {
      ipAttempts.set(clientIp, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxAttempts) {
      const waitMinutes = Math.ceil((record.resetTime - now) / 60000);
      return res.status(429).json({
        error: true,
        message: `${message} Espera ${waitMinutes} minuto(s).`,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }

    record.count += 1;
    next();
  };
}

// Limitador de creación de pedidos (SEC-11: previene ataques DoS o reservas masivas falsas)
export const orderCreationLimiter = rateLimiter({
  maxAttempts: 15,
  windowMs: 15 * 60 * 1000,
  message: 'Has realizado muchos pedidos recientemente desde esta conexión.'
});

// Limitador de subida de comprobantes bancarios
export const voucherUploadLimiter = rateLimiter({
  maxAttempts: 10,
  windowMs: 10 * 60 * 1000,
  message: 'Has intentado subir muchos comprobantes en poco tiempo.'
});

// Limitador de autenticación
export const authRateLimiter = rateLimiter({
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  message: 'Demasiados intentos de inicio de sesión fallidos.'
});

// Limitador de envío de reseñas y testimonios públicos (previene spam de valoraciones)
export const reviewSubmissionLimiter = rateLimiter({
  maxAttempts: 5,
  windowMs: 10 * 60 * 1000,
  message: 'Has enviado varias opiniones recientemente. Gracias por tu aporte.'
});
