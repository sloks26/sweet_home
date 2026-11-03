/**
 * Copia texto al portapapeles de manera 100% universal y compatible.
 * Funciona tanto en HTTPS como en conexiones HTTP sin certificado SSL,
 * utilizando un fallback con textarea temporal enfocado.
 */
export async function copyToClipboard(text) {
  if (!text && text !== 0) return false;
  const strText = String(text).trim();

  // 1. Intentar API moderna si estamos en contexto seguro (HTTPS o localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(strText);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard falló, aplicando fallback universal...', err);
    }
  }

  // 2. Fallback universal compatible con HTTP (Chrome, Safari, Firefox, Edge, Android, iOS)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = strText;
    textArea.style.fontSize = '12pt';
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);

    // Soporte táctil e iOS Safari
    if (typeof navigator !== 'undefined' && /ipad|ipod|iphone/i.test(navigator.userAgent)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.focus();
      textArea.select();
    }

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
}

export default copyToClipboard;
