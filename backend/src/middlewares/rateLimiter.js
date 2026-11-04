const ipAttempts = new Map();

/**
 * Limitador de intentos por IP para proteger endpoints críticos contra fuerza bruta
 * @param {Object} options
 * @param {number} options.maxAttempts - Intentos máximos en la ventana
 * @param {number} options.windowMs - Duración de la ventana en milisegundos
 * @param {string} options.message - Mensaje al exceder
 */
export function rateLimiter({
  maxAttempts = 10,
  windowMs = 15 * 60 * 1000,
  message = 'Demasiados intentos. Intenta de nuevo más tarde.'
}) {
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
