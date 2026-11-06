import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { formatColones } from '../../../utils/currency';

export const AdminProductsDesktopTable = ({
  loading,
  products = [],
  openEditModal,
  handleDeleteProduct,
  handleToggleProduct,
  totalCount,
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  return (
    <div className="hidden lg:block rounded-2xl border border-gold-DEFAULT/20 overflow-hidden bg-night-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-night-950/80 border-b border-night-700 text-gold-light font-semibold">
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Precio (₡)</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Visibilidad</th>
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
                const coverImage =
                  prod.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&q=80';
                return (
                  <tr key={prod.id} className="hover:bg-night-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={coverImage}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-night-700 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&q=80';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-text-primary line-clamp-1">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-text-muted font-mono">{prod.sku}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-text-secondary">
                      <div>{prod.category?.name || 'Sin Categoría'}</div>
                      {prod.subcategory && (
                        <div className="text-[11px] text-gold-bright/80">
                          {prod.subcategory.name}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-gold-light">
                      {formatColones(prod.price)}
                      {prod.compareAtPrice && (
                        <span className="text-[10px] text-text-muted line-through ml-1 font-normal">
                          {formatColones(prod.compareAtPrice)}
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
                        title="Clic para mostrar u ocultar en el catálogo público"
                      >
                        <Badge
                          variant={
                            !prod.isActive ? 'outline' : prod.stock <= 0 ? 'warning' : 'success'
                          }
                          size="sm"
                        >
                          {!prod.isActive
                            ? 'Oculto'
                            : prod.stock <= 0
                              ? 'Visible (Sin Stock)'
                              : 'Visible'}
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
  );
};

export default AdminProductsDesktopTable;
