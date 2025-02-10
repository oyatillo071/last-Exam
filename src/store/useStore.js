import { create } from "zustand";
import { persist } from "zustand/middleware";
import data from "../data.json";

const useStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      invoices: data,
      selectedFilter: "all",

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setFilter: (filter) => set({ selectedFilter: filter }),
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, invoice],
        })),
      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
        })),
      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),
    }),
    {
      name: "invoice-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
