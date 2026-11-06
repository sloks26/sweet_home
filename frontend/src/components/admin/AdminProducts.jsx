import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, RefreshCw, Package } from 'lucide-react';
import Button from '../ui/Button';
import AdminProductModal from './subcomponents/AdminProductModal';
import AdminProductsMobileList from './subcomponents/AdminProductsMobileList';
import AdminProductsDesktopTable from './subcomponents/AdminProductsDesktopTable';

export const AdminProducts = ({ initialStockStatus = '' }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [prevStockStatusProp, setPrevStockStatusProp] = useState(initialStockStatus);
  const [stockStatus, setStockStatus] = useState(initialStockStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  if (initialStockStatus !== undefined && initialStockStatus !== prevStockStatusProp) {
    setPrevStockStatusProp(initialStockStatus);
    setStockStatus(initialStockStatus);
  }

  // Modal Crear / Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Formulario de Producto
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [images, setImages] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  }, []);

  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (stockStatus) params.append('stockStatus', stockStatus);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, stockStatus, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
    const timer = setInterval(() => {
      fetchProducts(true);
    }, 45000);
    return () => clearInterval(timer);
  }, [fetchProducts]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku('');
    setCategoryId(categories[0]?.id || '');
    setSubcategoryId('');
    setPrice('');
    setCompareAtPrice('');
    setStock('10');
    setDescription('');
    setShortDescription('');
    setIsFeatured(false);
    setIsNew(true);
    setIsBestSeller(false);
    setIsAdult(false);
    setImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSku(prod.sku || '');
    setCategoryId(prod.categoryId || '');
    setSubcategoryId(prod.subcategoryId || '');
    setPrice(prod.price?.toString() || '');
    setCompareAtPrice(prod.compareAtPrice ? prod.compareAtPrice.toString() : '');
    setStock(prod.stock?.toString() || '0');
    setDescription(prod.description || '');
    setShortDescription(prod.shortDescription || '');
    setIsFeatured(prod.isFeatured || false);
    setIsNew(prod.isNew || false);
    setIsBestSeller(prod.isBestSeller || false);
    setIsAdult(prod.isAdult || false);
    setImages(prod.images || []);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: name.trim(),
      sku: sku.trim() || undefined,
      categoryId,
      subcategoryId: subcategoryId || null,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      stock: parseInt(stock, 10) || 0,
      description: description.trim(),
      shortDescription: shortDescription.trim() || null,
      isFeatured,
      isNew,
      isBestSeller,
      isAdult,
      images: images.map((img) => (typeof img === 'string' ? img : img.url))
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data.message || 'Error al guardar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id, prodName) => {
    if (!window.confirm(`¿Estás segura de eliminar el producto "${prodName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || 'Error al eliminar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProduct = async (id) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
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
            <Package className="w-3.5 h-3.5" />
            <span>Inventario & Colecciones ({totalCount} artículos)</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Catálogo de Productos
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
            Gestiona inventario, precios en colones (₡), fotografías 1:1 y colecciones exclusivas
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            icon={RefreshCw}
            onClick={() => fetchProducts(false)}
            disabled={loading}
            title="Sincronizar y actualizar productos ahora"
          >
            Actualizar
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={openCreateModal}>
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Píldoras Rápidas de Estado de Stock */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-night-900 border border-gold-DEFAULT/15">
        {[
          { id: '', label: 'Todos los Productos' },
          { id: 'in', label: 'En Stock (> 0)' },
          { id: 'low', label: 'Stock Bajo (≤ 5)', highlight: true },
          { id: 'out', label: 'Agotados (0)' }
        ].map((tab) => (
          <button
            key={tab.id || 'all'}
            type="button"
            onClick={() => {
              setStockStatus(tab.id);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              stockStatus === tab.id
                ? 'bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark text-night-950 font-bold shadow-sm'
                : tab.highlight
                  ? 'text-amber-300 hover:bg-night-800'
                  : 'text-text-secondary hover:text-gold-light hover:bg-night-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-2xl bg-night-900 border border-gold-DEFAULT/15 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, SKU o descripción..."
              className="w-full bg-night-800 text-text-primary rounded-xl pl-9 pr-4 py-2 text-xs border border-night-600 focus:outline-none focus:border-gold-DEFAULT placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-night-800 text-text-primary rounded-xl px-3 py-2 text-xs border border-night-600 focus:outline-none focus:border-gold-DEFAULT cursor-pointer"
          >
            <option value="">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="bg-night-800 text-text-primary rounded-xl px-3 py-2 text-xs border border-night-600 focus:outline-none focus:border-gold-DEFAULT cursor-pointer"
          >
            <option value="">Cualquier Stock</option>
            <option value="in">En Stock (&gt; 0)</option>
            <option value="low">Stock Bajo (&le; 5)</option>
            <option value="out">Agotados (0)</option>
          </select>
        </div>
      </div>

      {/* Lista de Tarjetas para Celular y Tablet (< 1024px) */}
      <AdminProductsMobileList
        products={products}
        onEdit={openEditModal}
        onDelete={handleDeleteProduct}
        onToggleActive={handleToggleProduct}
        loading={loading}
      />

      {/* Tabla de Productos para Pantallas Grandes (Desktop >= 1024px) */}
      <AdminProductsDesktopTable
        loading={loading}
        products={products}
        openEditModal={openEditModal}
        handleDeleteProduct={handleDeleteProduct}
        handleToggleProduct={handleToggleProduct}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Modal Crear / Editar */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        categories={categories}
        name={name}
        setName={setName}
        sku={sku}
        setSku={setSku}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        subcategoryId={subcategoryId}
        setSubcategoryId={setSubcategoryId}
        price={price}
        setPrice={setPrice}
        compareAtPrice={compareAtPrice}
        setCompareAtPrice={setCompareAtPrice}
        stock={stock}
        setStock={setStock}
        description={description}
        setDescription={setDescription}
        shortDescription={shortDescription}
        setShortDescription={setShortDescription}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        isNew={isNew}
        setIsNew={setIsNew}
        isBestSeller={isBestSeller}
        setIsBestSeller={setIsBestSeller}
        isAdult={isAdult}
        setIsAdult={setIsAdult}
        images={images}
        setImages={setImages}
        onSave={handleSaveProduct}
        isSaving={isSaving}
      />
    </div>
  );
};

export default AdminProducts;
