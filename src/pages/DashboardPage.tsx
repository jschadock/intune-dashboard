import { TopBar } from '../components/layout/TopBar';
import { KPIGrid } from '../components/kpi/KPIGrid';
import { AppStatusPieChart } from '../components/charts/AppStatusPieChart';
import { ProfileComplianceBar } from '../components/charts/ProfileComplianceBar';
import { useDeviceMetrics } from '../hooks/useDeviceMetrics';
import { useDiagStore } from '../stores/diagStore';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const isLoaded = useDiagStore((s) => s.isLoaded);
  const configProfiles = useDiagStore((s) => s.configProfiles);
  const metrics = useDeviceMetrics();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div>
        <TopBar title="Dashboard" subtitle="Übersicht der Intune-Diagnose" />
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 space-y-4">
          <span className="text-5xl">📊</span>
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
      <TopBar title="Dashboard" subtitle="Übersicht der Intune-Diagnose" />
      <div className="p-6 space-y-6">
        <KPIGrid />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppStatusPieChart
            data={metrics.policyStatusData}
            title="Policy-Status Verteilung"
          />
          <AppStatusPieChart
            data={metrics.appStatusData}
            title="App-Installationsstatus"
          />
        </div>

        <ProfileComplianceBar profiles={configProfiles} />
      </div>
    </div>
  );
}
