import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  UserX,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  Phone
} from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';
import Badge from '../../ui/Badge';

export const AdminUsersSection = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal para crear usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF');
  const [phone, setPhone] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setError(data.message || 'No se pudieron cargar los usuarios');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error de conexión al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Por favor completa el nombre, correo y contraseña.');
      return;
    }
    if (password.length < 8) {
      alert('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          phone: phone.trim() || null
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Usuario ${data.data.name} creado exitosamente.`);
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        fetchUsers();
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        alert(data.message || 'Error al crear el usuario');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al registrar usuario');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUserId) {
      alert('No puedes desactivar tu propia cuenta activa.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message || 'Error al cambiar estado');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUserId) {
      alert('No puedes eliminar tu propia cuenta.');
      return;
    }

    if (
      !window.confirm(
        `¿Estás segura de eliminar al usuario "${user.name}" (${user.email})? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setSuccessMsg(`Usuario ${user.name} eliminado.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-night-900 border border-gold-DEFAULT/20">
        <div>
          <div className="flex items-center gap-2 text-gold-DEFAULT font-semibold text-sm">
            <Users className="w-4 h-4" />
            <span>Equipo de Gestión y Usuarios</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Administra los accesos de la dueña y colaboradoras secundarias. Todos los usuarios
            autorizados verán los mismos productos e imágenes en tiempo real.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsModalOpen(true)}>
          Nuevo Usuario
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lista de Usuarios */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold-DEFAULT" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => {
            const isOwner = u.role === 'ADMIN';
            const isCurrent = u.id === currentUserId;

            return (
              <div
                key={u.id}
                className={`p-4 rounded-xl border transition-all ${
                  u.isActive
                    ? 'bg-night-900/90 border-night-700 hover:border-gold-DEFAULT/40'
                    : 'bg-night-950/60 border-night-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isOwner
                          ? 'bg-gold-DEFAULT/20 text-gold-light border border-gold-DEFAULT/40'
                          : 'bg-night-800 text-text-primary border border-night-700'
                      }`}
                    >
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-sm truncate">
                          {u.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-gold-DEFAULT/15 text-gold-light px-1.5 py-0.5 rounded font-medium">
                            Tú
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary truncate mt-0.5 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant={isOwner ? 'gold' : 'neutral'} size="sm">
                    {isOwner ? 'Dueña / Admin' : 'Asistente / Staff'}
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-night-800 flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}
                    />
                    <span>{u.isActive ? 'Activo' : 'Desactivado'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCurrent && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-night-800 hover:bg-night-700 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                          {u.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          className="p-1 rounded text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Crear Usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Usuario para el Panel"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Nombre Completo"
            placeholder="Ej: Sofía (Asistente)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={UserIcon}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@sweethomeboutiquecr.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />

          <Input
            label="Contraseña de Acceso"
            type="text"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="Comparte esta contraseña con tu colaboradora para que pueda ingresar."
            icon={Lock}
          />

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Rol y Nivel de Acceso
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-night-900 border border-night-700 rounded-xl px-3 py-2 text-xs text-text-primary focus:border-gold-DEFAULT focus:outline-none"
            >
              <option value="STAFF">
                Asistente / Staff (Gestión de catálogo, fotos y pedidos)
              </option>
              <option value="ADMIN">Administradora (Acceso completo a todos los ajustes)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-night-800 flex justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={creating}
              icon={creating ? Loader2 : UserPlus}
            >
              {creating ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsersSection;
