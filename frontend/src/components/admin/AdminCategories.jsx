import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">
            Categorías y Subcategorías
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Organiza los 10 departamentos de la boutique, reordena el menú principal y administra subcategorías.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={openCreateModal}>
          Nueva Categoría
        </Button>
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
