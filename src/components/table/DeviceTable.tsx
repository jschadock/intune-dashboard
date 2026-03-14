import { useState, useMemo } from 'react';
import { StatusBadge } from './StatusBadge';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DeviceTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

export function DeviceTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 20,
}: DeviceTableProps<T>) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  // Reset page when data changes
  useMemo(() => setPage(0), [data.length]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 text-sm">
        Keine Einträge gefunden
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-surface-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-800 text-left">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors select-none"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        <span className="text-blue-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {pageData.map((row, i) => (
                <tr key={i} className="hover:bg-surface-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-300">
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Seite {page + 1} von {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 bg-surface-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Zurück
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 bg-surface-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Weiter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-export StatusBadge for convenience
export { StatusBadge };
