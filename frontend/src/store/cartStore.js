import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (product, variantOrQuantity = null, maybeQuantity = 1) => {
        let variantObj = null;
        let quantity = 1;

        if (typeof variantOrQuantity === 'number') {
          quantity = Math.max(1, variantOrQuantity);
          if (typeof maybeQuantity === 'object' && maybeQuantity !== null) {
            variantObj = maybeQuantity;
          }
        } else if (typeof variantOrQuantity === 'object' && variantOrQuantity !== null) {
          variantObj = variantOrQuantity;
          if (typeof maybeQuantity === 'number') {
            quantity = Math.max(1, maybeQuantity);
          }
        } else if (typeof maybeQuantity === 'number') {
          quantity = Math.max(1, maybeQuantity);
        }

        // Normalizar clave y etiqueta de variante
        let variantKey = 'default';
        let variantLabel = null;

        if (variantObj) {
          if (variantObj.name && variantObj.selectedOption) {
            variantKey = `${variantObj.name}_${variantObj.selectedOption}`;
            variantLabel = `${variantObj.name}: ${variantObj.selectedOption}`;
          } else {
            const entries = Object.entries(variantObj).filter(([_, v]) => Boolean(v));
            if (entries.length > 0) {
              variantKey = entries.sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join('|');
              variantLabel = entries.map(([k, v]) => `${k}: ${v}`).join(', ');
            }
          }
        }

        const items = get().items;
        const itemKey = `${product.id}_${variantKey}`;

        const existingIndex = items.findIndex((i) => i.key === itemKey);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated, isDrawerOpen: true });
        } else {
          set({
            items: [
              ...items,
              {
                key: itemKey,
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&q=80',
                sku: product.sku || 'SH-CR',
                variantName: variantLabel,
                quantity
              }
            ],
            isDrawerOpen: true
          });
        }
      },

      removeItem: (itemKey) => {
        set({ items: get().items.filter((i) => i.key !== itemKey) });
      },

      updateQuantity: (itemKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemKey);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.key === itemKey ? { ...i, quantity } : i
          )
        });
      },

      clearCart: () => set({ items: [] }),

      // Calculados
      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'sweet_home_cart'
    }
  )
);
