/**
 * Utilidades para personalizar el saludo y visualización de administradoras
 * Sweet Home & Boutique CR
 */

export function getAdminGreeting(user) {
  if (!user) return '¡Bienvenida!';

  const email = (user.email || '').toLowerCase().trim();
  const name = (user.name || '').toLowerCase();

  if (
    email === 'admin@sweethomeandboutiquecr.com' ||
    email === 'admin@sweethomeboutiquecr.com' ||
    name.includes('vanessa')
  ) {
    return '¡Bienvenida de nuevo, Vanessa!';
  }

  if (
    email === 'jendry@sweethomeandboutiquecr.com' ||
    email === 'jendry@sweethomeboutiquecr.com' ||
    name.includes('jendry')
  ) {
    return '¡Bienvenida, Jendry!';
  }

  return user.name ? `¡Bienvenida, ${user.name}!` : '¡Bienvenida al Panel!';
}

export function getAdminDisplayName(user) {
  if (!user) return 'Administradora';

  const email = (user.email || '').toLowerCase().trim();
  const name = (user.name || '').toLowerCase();

  if (
    email === 'admin@sweethomeandboutiquecr.com' ||
    email === 'admin@sweethomeboutiquecr.com' ||
    name.includes('vanessa')
  ) {
    return 'Vanessa';
  }

  if (
    email === 'jendry@sweethomeandboutiquecr.com' ||
    email === 'jendry@sweethomeboutiquecr.com' ||
    name.includes('jendry')
  ) {
    return 'Jendry';
  }

  return user.name || 'Administradora';
}

export default {
  getAdminGreeting,
  getAdminDisplayName
};
