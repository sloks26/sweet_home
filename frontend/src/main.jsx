import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Recuperación automática de versiones en caso de cambio de chunks por despliegue
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Nueva versión detectada en el servidor, recargando...', event);
  window.location.reload();
});

window.addEventListener('error', (event) => {
  const msg = event?.message || '';
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes("Unexpected token '<'")
  ) {
    const lastReload = sessionStorage.getItem('last_auto_reload');
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem('last_auto_reload', now.toString());
      window.location.reload();
    }
  }
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error no controlado en la aplicación:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#12071F] text-[#F8F1FF] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md p-8 rounded-3xl bg-[#1B0B30] border border-[#F2C14E]/30 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F2C14E]/20 text-[#F2C14E] flex items-center justify-center mx-auto text-xl font-bold">
              ✨
            </div>
            <h2 className="text-xl font-bold font-serif text-[#F2C14E]">
              Sweet Home & Boutique CR
            </h2>
            <p className="text-xs text-[#C9B8E0]">
              Estamos actualizando la tienda con mejoras recientes. Haz clic abajo para cargar la versión más reciente.
            </p>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#F2C14E] text-[#12071F] font-bold text-xs uppercase tracking-wider hover:bg-[#FFE08A] transition-all cursor-pointer shadow-lg"
            >
              Recargar Tienda
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
