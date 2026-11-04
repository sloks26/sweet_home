import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Cerrar al presionar Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword
        })
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setLoginError(data.message || data.error || 'Credenciales inválidas');
      } else {
        onClose();
        if (onLoginSuccess) onLoginSuccess(data.user);
      }
    } catch (err) {
      setLoginError('Error de conexión con el servidor.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 min-h-screen min-h-[100dvh] overflow-y-auto pointer-events-auto"
      style={{
        background: "url('/images/admin-login-bg.webp') center/cover no-repeat fixed"
      }}
    >
      {/* Velo oscuro sutil para realzar el contraste estético (sin cerrar al tocar fuera) */}
      <div className="fixed inset-0 bg-night-950/40 backdrop-blur-[2px] pointer-events-none" />

      {/* Tarjeta Limpia y Elegante estilo Bloomed Studio */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-7 sm:p-10 border border-stone-200/80 animate-in fade-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
        }}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          title="Cerrar y volver a la tienda"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="text-center mb-7">
          <h2
            id="admin-login-title"
            className="font-serif text-2xl sm:text-[26px] font-normal text-stone-800 tracking-tight"
          >
            Sweet Home & Boutique
          </h2>
          <p className="text-[#C5A059] text-[11px] font-bold tracking-[0.2em] uppercase mt-1.5">
            Acceso Administrativo
          </p>
        </div>

        {/* Mensaje de Error */}
        {loginError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/80 text-red-600 text-xs text-center font-medium">
            {loginError}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder=""
              className="w-full px-4 py-3.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/25 transition-all"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder=""
                className="w-full px-4 py-3.5 pr-11 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/25 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full mt-2 py-4 rounded-full bg-[#C5A059] hover:bg-[#B38F48] active:scale-[0.99] text-white font-semibold text-sm tracking-wider uppercase shadow-md shadow-[#C5A059]/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? 'Verificando...' : 'Ingresar al Panel'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>← Volver a la tienda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
