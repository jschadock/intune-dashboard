interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusOptions: string[];
  typeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
  typeOptions?: string[];
  resultCount: number;
}

export function TableToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  typeFilter,
  onTypeFilterChange,
  typeOptions,
  resultCount,
}: TableToolbarProps) {
  const statusLabels: Record<string, string> = {
    all: 'Alle Status',
    Applied: 'Angewendet',
    Installed: 'Installiert',
    Failed: 'Fehlgeschlagen',
    Pending: 'Ausstehend',
    NotInstalled: 'Nicht installiert',
    Unknown: 'Unbekannt',
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Suchen..."
          className="w-full pl-9 pr-4 py-2 bg-surface-900 border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="bg-surface-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-blue-500/50"
      >
        <option value="all">Alle Status</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s] || s}
          </option>
        ))}
      </select>

      {typeOptions && onTypeFilterChange && (
        <select
          value={typeFilter || 'all'}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="bg-surface-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-blue-500/50"
        >
          <option value="all">Alle Typen</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}

      <span className="text-xs text-gray-600">{resultCount} Einträge</span>
    </div>
  );
}
