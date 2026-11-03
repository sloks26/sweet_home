/**
 * Proxy de compatibilidad hacia los subcontroladores modulares de administración.
 * Cada subcontrolador reside en ./admin/ y mantiene un tamaño menor a 400 líneas.
 */
export * from './admin/index.js';
export { adminController } from './admin/index.js';
import { adminController } from './admin/index.js';
export default adminController;
