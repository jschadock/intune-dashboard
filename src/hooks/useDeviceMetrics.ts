import { useMemo } from 'react';
import { useDiagStore } from '../stores/diagStore';

export function useDeviceMetrics() {
  const configProfiles = useDiagStore((s) => s.configProfiles);
  const appDeployments = useDiagStore((s) => s.appDeployments);
  const deviceInfo = useDiagStore((s) => s.deviceInfo);
  const files = useDiagStore((s) => s.files);

  return useMemo(() => {
    const totalPolicies = configProfiles.length;
    const appliedPolicies = configProfiles.filter((p) => p.status === 'Applied').length;
    const failedPolicies = configProfiles.filter((p) => p.status === 'Failed').length;
    const pendingPolicies = configProfiles.filter((p) => p.status === 'Pending').length;
    const policySuccessRate = totalPolicies > 0 ? Math.round((appliedPolicies / totalPolicies) * 100) : 0;

    const totalApps = appDeployments.length;
    const installedApps = appDeployments.filter((a) => a.installState === 'Installed').length;
    const failedApps = appDeployments.filter((a) => a.installState === 'Failed').length;
    const pendingApps = appDeployments.filter((a) => a.installState === 'Pending').length;
    const appSuccessRate = totalApps > 0 ? Math.round((installedApps / totalApps) * 100) : 0;

    const totalFiles = files.length;
    const parsedFiles = files.filter((f) => f.parsed).length;

    // Chart data
    const policyStatusData = [
      { name: 'Angewendet', value: appliedPolicies, color: '#22c55e' },
      { name: 'Fehlgeschlagen', value: failedPolicies, color: '#ef4444' },
      { name: 'Ausstehend', value: pendingPolicies, color: '#f59e0b' },
      { name: 'Unbekannt', value: totalPolicies - appliedPolicies - failedPolicies - pendingPolicies, color: '#6b7280' },
    ].filter((d) => d.value > 0);

    const appStatusData = [
      { name: 'Installiert', value: installedApps, color: '#22c55e' },
      { name: 'Fehlgeschlagen', value: failedApps, color: '#ef4444' },
      { name: 'Ausstehend', value: pendingApps, color: '#f59e0b' },
      { name: 'Nicht installiert', value: totalApps - installedApps - failedApps - pendingApps, color: '#6b7280' },
    ].filter((d) => d.value > 0);

    return {
      totalPolicies,
      appliedPolicies,
      failedPolicies,
      pendingPolicies,
      policySuccessRate,
      totalApps,
      installedApps,
      failedApps,
      pendingApps,
      appSuccessRate,
      totalFiles,
      parsedFiles,
      lastSync: deviceInfo?.lastSyncTime ?? null,
      policyStatusData,
      appStatusData,
    };
  }, [configProfiles, appDeployments, deviceInfo, files]);
}
