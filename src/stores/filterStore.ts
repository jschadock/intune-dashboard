import { create } from 'zustand';

interface FilterState {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;

  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: '',
  statusFilter: 'all',
  typeFilter: 'all',

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  resetFilters: () => set({ searchTerm: '', statusFilter: 'all', typeFilter: 'all' }),
}));
