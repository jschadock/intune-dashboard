import { TopBar } from '../components/layout/TopBar';
import { RawLogViewer } from '../components/rawlogs/RawLogViewer';
import { useDiagStore } from '../stores/diagStore';
import { useNavigate } from 'react-router-dom';

export function RawLogsPage() {
  const isLoaded = useDiagStore((s) => s.isLoaded);
  const logFiles = useDiagStore((s) => s.logFiles);
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div>
        <TopBar title="Rohdaten" />
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 space-y-4">
          <span className="text-5xl">📄</span>
          <p>Noch keine Daten geladen</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors"
          >
            Diagnosepaket hochladen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title="Rohdaten"
        subtitle={`${logFiles.length} Dateien verfügbar`}
      />
      <div className="p-6">
        <RawLogViewer logFiles={logFiles} />
      </div>
    </div>
  );
}
