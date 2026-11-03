import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAgeGateStore = create(
  persist(
    (set) => ({
      isAdultVerified: false,
      isModalOpen: false,
      pendingDestination: null,

      verifyAge: () => set({ isAdultVerified: true, isModalOpen: false }),
      promptAgeGate: (destination = null) => set({ isModalOpen: true, pendingDestination: destination }),
      closeModal: () => set({ isModalOpen: false, pendingDestination: null }),
      resetVerification: () => set({ isAdultVerified: false })
    }),
    {
      name: 'sweet_home_age_gate'
    }
  )
);
