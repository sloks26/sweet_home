import React, { useState, useEffect } from 'react';
import { Plus, FolderTree, Layers, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import AdminCategoryModal from './subcomponents/AdminCategoryModal';
import AdminCategoryRow from './subcomponents/AdminCategoryRow';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Categoría
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Acordeón de subcategorías desplegadas
  const [expandedCatId, setExpandedCatId] = useState(null);

  // Estado para agregar subcategoría
  const [newSubcatName, setNewSubcatName] = useState('');
  const [addingSubcatFor, setAddingSubcatFor] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id, catName) => {
    if (!window.confirm(`¿Estás segura de eliminar la categoría "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.message || 'Error al eliminar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    setCategories(newCategories);

    try {
      const orderedIds = newCategories.map((c) => c.id);
      await fetch('/api/admin/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
    } catch (err) {
      console.error(err);
      fetchCategories();
    }
  };

  const handleAddSubcategory = async (catId) => {
    if (!newSubcatName.trim()) return;

    try {
      const res = await fetch(`/api/admin/categories/${catId}/subcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubcatName.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setNewSubcatName('');
        setAddingSubcatFor(null);
        fetchCategories();
      } else {
        alert(data.message || 'Error al crear subcategoría');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubcategory = async (subId, subName) => {
    if (!window.confirm(`¿Eliminar la subcategoría "${subName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/subcategories/${subId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.message || 'Error al eliminar subcategoría');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Ejecutivo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1036] via-[#150A26] to-[#11071F] border border-white/[0.08] border-t-gold-DEFAULT/35 p-5 sm:p-7 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/35 text-gold-bright text-xs font-semibold mb-1">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Estructura del Catálogo de la Tienda</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Categorías y Subcategorías
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
            Aquí administras los departamentos del menú principal de tu tienda y las subcategorías
            internas donde se clasifican tus productos.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={openCreateModal}>
          Nueva Categoría
        </Button>
      </div>

      {/* Guía Visual Rápida de 3 Pasos para que sea 100% intuitivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#140A24]/90 border border-white/[0.07] border-l-2 border-l-gold-DEFAULT flex items-start gap-3">
          <div className="p-2 rounded-xl bg-gold-DEFAULT/15 text-gold-bright shrink-0">
            <FolderTree className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-text-primary">1. ¿Qué es una Categoría?</p>
            <p className="text-text-secondary leading-relaxed">
              Son los departamentos del menú principal de la web (ej. <em>Hogar, Moda, Perfumes</em>
              ). Usa las flechas <strong>↑ ↓</strong> para elegir cuál sale de primero.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140A24]/90 border border-white/[0.07] border-l-2 border-l-emerald-400 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-text-primary">2. ¿Qué son las Subcategorías?</p>
            <p className="text-text-secondary leading-relaxed">
              Son las divisiones dentro de cada categoría (ej. dentro de <em>Hogar</em> están{' '}
              <em>Cocina, Sala, Dormitorio</em>) para que el cliente filtre rápido.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140A24]/90 border border-white/[0.07] border-l-2 border-l-sky-400 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-text-primary">3. ¿Cómo agrego productos?</p>
            <p className="text-text-secondary leading-relaxed">
              Aquí creas los nombres de las secciones. Luego en la pestaña{' '}
              <strong className="text-gold-light">Productos</strong> eliges en cuál Categoría y
              Subcategoría va cada artículo.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Categorías con Reordenamiento y Subcategorías */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-text-muted text-xs">
            Cargando departamentos y categorías...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-xs">
            No hay categorías registradas.
          </div>
        ) : (
          categories.map((cat, index) => (
            <AdminCategoryRow
              key={cat.id}
              cat={cat}
              index={index}
              totalCount={categories.length}
              isExpanded={expandedCatId === cat.id}
              onToggleExpand={() => setExpandedCatId(expandedCatId === cat.id ? null : cat.id)}
              onMoveOrder={handleMoveOrder}
              onEdit={openEditModal}
              onDelete={handleDeleteCategory}
              addingSubcatFor={addingSubcatFor}
              setAddingSubcatFor={setAddingSubcatFor}
              newSubcatName={newSubcatName}
              setNewSubcatName={setNewSubcatName}
              onAddSubcategory={handleAddSubcategory}
              onDeleteSubcategory={handleDeleteSubcategory}
            />
          ))
        )}
      </div>

      {/* MODAL CREAR / EDITAR CATEGORÍA */}
      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        editingCategory={editingCategory}
        onSaveSuccess={fetchCategories}
      />
    </div>
  );
};

export default AdminCategories;
