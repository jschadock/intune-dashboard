import { useMemo, useState, useEffect } from 'react';

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface FilterOptions {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
}

export function useFilteredData<T extends Record<string, unknown>>(
  data: T[],
  options: FilterOptions,
  searchFields: (keyof T)[],
  statusField: keyof T,
  typeField?: keyof T
): T[] {
  const debouncedSearch = useDebouncedValue(options.searchTerm, 300);

  return useMemo(() => {
    let filtered = data;

    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          return typeof val === 'string' && val.toLowerCase().includes(lower);
        })
      );
    }

    if (options.statusFilter && options.statusFilter !== 'all') {
      filtered = filtered.filter((item) => item[statusField] === options.statusFilter);
    }

    if (typeField && options.typeFilter && options.typeFilter !== 'all') {
      filtered = filtered.filter((item) => item[typeField] === options.typeFilter);
    }

    return filtered;
  }, [data, debouncedSearch, options.statusFilter, options.typeFilter, searchFields, statusField, typeField]);
}
