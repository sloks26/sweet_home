import prisma from '../config/prisma.js';

/**
 * Registra una acción en la bitácora de auditoría
 * @param {Object} params
 * @param {string} [params.userId]
 * @param {string} params.action - Ej: LOGIN, CREATE_PRODUCT, CONFIRM_PAYMENT
 * @param {string} params.module - Ej: AUTH, PRODUCTS, ORDERS, BANNERS, CONTENT
 * @param {Object|string} [params.details]
 * @param {import('express').Request} [params.req]
 */
export async function logAudit({ userId, action, module, details, req }) {
  try {
    const ipAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req?.headers['user-agent'] || 'Desconocido';
    const serializedDetails = typeof details === 'object' ? JSON.stringify(details) : details;

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        module,
        details: serializedDetails,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress.split(',')[0].trim(),
        userAgent: userAgent.slice(0, 255)
      }
    });
  } catch (err) {
    console.error('Error registrando bitácora de auditoría:', err.message);
  }
}
