/**
 * Utilidades centralizadas para formateo de moneda (Colones costarricenses ₡) y fechas
 */

/**
 * Formatea un monto numérico a formato oficial de Colones costarricenses
 * Ej: 25000 -> "₡25 000" o "₡25,000" según locale es-CR
 * @param {number|string} amount - Monto a formatear
 * @returns {string} Cadena formateada con símbolo de colón
 */
export function formatColones(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '₡0';
  return `₡${num.toLocaleString('es-CR')}`;
}

/**
 * Formato compacto para gráficas, KPIs y badges
 * Ej: 25000 -> "₡25k", 1500000 -> "₡1.5M"
 * @param {number|string} amount
 * @returns {string}
 */
export function formatCompactColones(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '₡0';
  if (Math.abs(num) >= 1_000_000) {
    return `₡${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `₡${(num / 1_000).toFixed(0)}k`;
  }
  return `₡${num.toLocaleString('es-CR')}`;
}

/**
 * Formateo estándar de fechas para Costa Rica
 * @param {string|Date} dateInput
 * @param {Object} [options]
 * @returns {string}
 */
export function formatDateCR(dateInput, options = {}) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options
  };

  return date.toLocaleDateString('es-CR', defaultOptions);
}

/**
 * Formateo de fecha y hora completa
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDateTimeCR(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
