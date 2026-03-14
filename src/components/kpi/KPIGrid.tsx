import { KPICard } from './KPICard';
import { useDeviceMetrics } from '../../hooks/useDeviceMetrics';
import { formatDate } from '../../utils/dateUtils';

export function KPIGrid() {
  const m = useDeviceMetrics();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard
        title="Policies gesamt"
        value={m.totalPolicies}
        subtitle={`${m.parsedFiles} von ${m.totalFiles} Dateien verarbeitet`}
        color="blue"
      />
      <KPICard
        title="Angewendet"
        value={`${m.policySuccessRate}%`}
        subtitle={`${m.appliedPolicies} von ${m.totalPolicies}`}
        color="green"
      />
      <KPICard
        title="Policy-Fehler"
        value={m.failedPolicies}
        subtitle={m.failedPolicies > 0 ? 'Überprüfung erforderlich' : 'Keine Fehler'}
        color={m.failedPolicies > 0 ? 'red' : 'green'}
      />
      <KPICard
        title="Apps gesamt"
        value={m.totalApps}
        subtitle={`${m.appSuccessRate}% installiert`}
        color="blue"
      />
      <KPICard
        title="App-Fehler"
        value={m.failedApps}
        subtitle={m.failedApps > 0 ? 'Installation fehlgeschlagen' : 'Alle erfolgreich'}
        color={m.failedApps > 0 ? 'red' : 'green'}
      />
      <KPICard
        title="Letzter Sync"
        value={m.lastSync ? formatDate(m.lastSync).split(' ')[0] : '—'}
        subtitle={m.lastSync ? formatDate(m.lastSync).split(' ')[1] || '' : 'Kein Sync-Datum'}
        color="gray"
      />
    </div>
  );
}
