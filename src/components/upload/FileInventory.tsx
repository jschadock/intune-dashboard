import { useDiagStore } from '../../stores/diagStore';

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const categoryIcons: Record<string, string> = {
  xml: '📋',
  html: '🌐',
  log: '📝',
  reg: '🔧',
  etl: '📊',
  evtx: '📊',
  other: '📎',
};

const categoryLabels: Record<string, string> = {
  xml: 'XML',
  html: 'HTML',
  log: 'Log',
  reg: 'Registry',
  etl: 'Event Trace',
  evtx: 'Event Log',
  other: 'Sonstige',
};

export function FileInventory() {
  const files = useDiagStore((s) => s.files);

  if (files.length === 0) return null;

  const categoryCounts = files.reduce(
    (acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">
          Dateien im Paket ({files.length})
        </h3>
        <div className="flex gap-2">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <span
              key={cat}
              className="text-xs px-2 py-0.5 bg-surface-800 text-gray-500 rounded"
            >
              {categoryLabels[cat] || cat}: {count}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-surface-900 border border-gray-800 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-800">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Datei</th>
              <th className="px-4 py-2">Typ</th>
              <th className="px-4 py-2 text-right">Größe</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {files.map((file, i) => (
              <tr key={i} className="hover:bg-surface-800/50 transition-colors">
                <td className="px-4 py-2 text-gray-300 font-mono text-xs truncate max-w-xs" title={file.path}>
                  <span className="mr-2">{categoryIcons[file.category] || '📎'}</span>
                  {file.name}
                </td>
                <td className="px-4 py-2 text-gray-500 text-xs">
                  {categoryLabels[file.category] || file.extension.toUpperCase()}
                </td>
                <td className="px-4 py-2 text-gray-500 text-xs text-right">
                  {formatSize(file.size)}
                </td>
                <td className="px-4 py-2 text-center">
                  {file.parsed ? (
                    <span className="text-green-400 text-xs">✓ Verarbeitet</span>
                  ) : file.category === 'etl' || file.category === 'evtx' ? (
                    <span className="text-yellow-400 text-xs">⚠ Binär</span>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
