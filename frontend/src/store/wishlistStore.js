import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // Array de objetos de producto simplificados

      toggleWishlist: (product) => {
        const items = get().items;
        const exists = items.some((p) => p.id === product.id);

        if (exists) {
          set({ items: items.filter((p) => p.id !== product.id) });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                image: product.images?.[0]?.url,
                categoryName: product.category?.name
              }
            ]
          });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
      },

      getCount: () => get().items.length,

      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'sweet_home_wishlist'
    }
  )
);
