interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Applied: 'bg-green-500/15 text-green-400 border-green-500/30',
  Installed: 'bg-green-500/15 text-green-400 border-green-500/30',
  Failed: 'bg-red-500/15 text-red-400 border-red-500/30',
  Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  NotInstalled: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  Unknown: 'bg-gray-500/15 text-gray-500 border-gray-500/30',
};

const statusLabels: Record<string, string> = {
  Applied: 'Angewendet',
  Installed: 'Installiert',
  Failed: 'Fehlgeschlagen',
  Pending: 'Ausstehend',
  NotInstalled: 'Nicht installiert',
  Unknown: 'Unbekannt',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.Unknown;
  const label = statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {label}
    </span>
  );
}
