import { create } from 'zustand'
import { persist, PersistStorage } from 'zustand/middleware'

interface FilterStore {
  filters: string[]
  addFilter: (filter: string) => void
  removeFilter: (filter: string) => void
  clearFilters: () => void
}

const createStorage = (): PersistStorage<FilterStore> | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return {
    getItem: (name: string) => {
      try {
        const item = localStorage.getItem(name)
        return item ? JSON.parse(item) : null
      } catch {
        return null
      }
    },
    setItem: (name: string, value: any) => {
      try {
        localStorage.setItem(name, JSON.stringify(value))
      } catch {
        // ignore
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name)
      } catch {
        // ignore
      }
    },
  }
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: [],
      addFilter: (filter: string) =>
        set((state) => {
          const newFilters = state.filters.includes(filter)
            ? state.filters
            : [...state.filters, filter]
          return { filters: newFilters }
        }),
      removeFilter: (filter: string) =>
        set((state) => ({
          filters: state.filters.filter((f) => f !== filter),
        })),
      clearFilters: () => set({ filters: [] }),
    }),
    {
      name: 'job-filters',
      storage: createStorage(),
    }
  )
)
