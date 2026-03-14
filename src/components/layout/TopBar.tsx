import { useUploadStore } from '../../stores/uploadStore';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const fileName = useUploadStore((s) => s.fileName);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-surface-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {fileName && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-gray-600">Datei:</span>
          <span className="text-gray-400 font-mono text-xs bg-surface-800 px-2 py-1 rounded">
            {fileName}
          </span>
        </div>
      )}
    </header>
  );
}
