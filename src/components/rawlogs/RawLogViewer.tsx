import { useState } from 'react';

interface RawLogViewerProps {
  logFiles: { name: string; content: string }[];
}

export function RawLogViewer({ logFiles }: RawLogViewerProps) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  if (logFiles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 text-sm">
        Keine Logdateien im Diagnosepaket gefunden
      </div>
    );
  }

  const currentFile = logFiles[selectedFile];
  const lines = currentFile.content.split('\n');
  const filteredLines = searchTerm
    ? lines.filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
    : lines;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedFile}
          onChange={(e) => {
            setSelectedFile(Number(e.target.value));
            setSearchTerm('');
          }}
          className="bg-surface-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-blue-500/50"
        >
          {logFiles.map((f, i) => (
            <option key={i} value={i}>
              {f.name} ({Math.round(f.content.length / 1024)} KB)
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="In Datei suchen..."
            className="w-full pl-9 pr-4 py-2 bg-surface-900 border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <span className="text-xs text-gray-600">
          {filteredLines.length} Zeilen
          {searchTerm && ` (gefiltert aus ${lines.length})`}
        </span>
      </div>

      <div className="bg-surface-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <pre className="p-4 text-xs font-mono text-gray-400 leading-relaxed whitespace-pre-wrap break-all">
            {filteredLines.map((line, i) => {
              const isError = /error|fail|exception/i.test(line);
              const isWarn = /warn/i.test(line);
              return (
                <div
                  key={i}
                  className={`py-0.5 ${
                    isError
                      ? 'text-red-400 bg-red-500/5'
                      : isWarn
                        ? 'text-yellow-400 bg-yellow-500/5'
                        : ''
                  }`}
                >
                  <span className="inline-block w-12 text-gray-700 text-right mr-4 select-none">
                    {i + 1}
                  </span>
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
