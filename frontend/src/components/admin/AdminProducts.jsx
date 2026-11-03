import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Eye,
  Sliders,
  Sparkles,
  PackageCheck,
  PackageX,
  RefreshCw
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import AdminProductModal from './subcomponents/AdminProductModal';
import AdminProductsMobileList from './subcomponents/AdminProductsMobileList';

export const AdminProducts = ({ initialStockStatus = '' }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatus, setStockStatus] = useState(initialStockStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (initialStockStatus !== undefined) {
      setStockStatus(initialStockStatus);
    }
  }, [initialStockStatus]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    const timer = setInterval(() => {
      fetchProducts(true);
    }, 45000);
    return () => clearInterval(timer);
  }, [search, selectedCategory, stockStatus, currentPage]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const fetchProducts = async (silent = false) => {
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
  };

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
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
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
      {/* Cabecera y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Catálogo de Productos
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Gestiona inventario, precios en colones (₡), fotografías 1:1 y colecciones exclusivas
          </p>
        </div>
        <div className="flex items-center gap-2.5">
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
      <div className="hidden lg:block rounded-2xl border border-gold-DEFAULT/20 overflow-hidden bg-night-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-night-950/80 border-b border-night-700 text-gold-light font-semibold">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Precio (₡)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-night-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-muted">
                    Cargando catálogo...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-muted">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const coverImage = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&q=80';
                  return (
                    <tr key={prod.id} className="hover:bg-night-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coverImage}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-night-700 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&q=80';
                            }}
                          />
                          <div>
                            <div className="font-semibold text-text-primary line-clamp-1">{prod.name}</div>
                            <div className="text-[11px] text-text-muted font-mono">{prod.sku}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-text-secondary">
                        <div>{prod.category?.name || 'Sin Categoría'}</div>
                        {prod.subcategory && (
                          <div className="text-[11px] text-gold-bright/80">{prod.subcategory.name}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 font-bold text-gold-light">
                        ₡{prod.price?.toLocaleString('es-CR')}
                        {prod.compareAtPrice && (
                          <span className="text-[10px] text-text-muted line-through ml-1 font-normal">
                            ₡{prod.compareAtPrice?.toLocaleString('es-CR')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {prod.stock <= 5 ? (
                          <span className="px-2 py-0.5 rounded-full bg-status-warning/15 text-amber-300 font-bold text-[10px] border border-status-warning/30">
                            {prod.stock === 0 ? 'Agotado' : `Bajo: ${prod.stock}`}
                          </span>
                        ) : (
                          <span className="text-text-primary font-medium">{prod.stock} u.</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleProduct(prod.id)}
                          className="cursor-pointer"
                          title="Clic para cambiar estado"
                        >
                          <Badge variant={prod.isActive ? 'success' : 'outline'} size="sm">
                            {prod.isActive ? 'Activo' : 'Pausado'}
                          </Badge>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 rounded-xl bg-night-800 hover:bg-gold-DEFAULT hover:text-night-950 text-text-secondary transition-all border border-gold-DEFAULT/15 cursor-pointer"
                            title="Editar Producto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-2 rounded-xl bg-status-error/10 hover:bg-status-error text-status-error hover:text-white transition-all border border-status-error/20 cursor-pointer"
                            title="Eliminar Producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-night-700 flex items-center justify-between text-xs text-text-secondary">
            <span>
              Total: <strong>{totalCount}</strong> productos
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

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
