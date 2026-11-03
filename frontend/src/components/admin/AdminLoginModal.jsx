import React, { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState('admin@sweethomeboutiquecr.com');
  const [loginPassword, setLoginPassword] = useState('SweetHomeCR2026!#');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setLoginError(data.message || 'Error al iniciar sesión');
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Acceso al Panel Administrativo"
      subtitle="Autenticación segura para la administración de Sweet Home & Boutique CR"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-night-900/90 border border-gold-DEFAULT/25 text-xs text-text-secondary space-y-2">
          <span className="font-semibold text-gold-light block">Cuentas de Socias Administradoras:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLoginEmail('admin@sweethomeboutiquecr.com')}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                loginEmail === 'admin@sweethomeboutiquecr.com'
                  ? 'bg-gold-DEFAULT/15 border-gold-DEFAULT text-gold-light'
                  : 'bg-night-800 border-night-700 text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="font-semibold text-[11px] text-text-primary">Maureen Sánchez</div>
              <div className="text-[10px] truncate">admin@sweethomeboutiquecr.com</div>
            </button>

            <button
              type="button"
              onClick={() => setLoginEmail('jendry@sweethomeboutiquecr.com')}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                loginEmail === 'jendry@sweethomeboutiquecr.com'
                  ? 'bg-gold-DEFAULT/15 border-gold-DEFAULT text-gold-light'
                  : 'bg-night-800 border-night-700 text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="font-semibold text-[11px] text-text-primary">Jendry Zúñiga</div>
              <div className="text-[10px] truncate">jendry@sweethomeboutiquecr.com</div>
            </button>
          </div>
          <div className="text-[11px] text-text-muted pt-1">Contraseña: <strong className="text-text-primary">SweetHomeCR2026!#</strong></div>
        </div>

        <Input
          label="Correo Electrónico"
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />

        {loginError && (
          <div className="p-2.5 rounded-lg bg-status-error/15 border border-status-error/30 text-xs text-status-error flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={Lock}
            isLoading={isLoggingIn}
          >
            Ingresar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminLoginModal;
