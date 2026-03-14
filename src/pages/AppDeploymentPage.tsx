import { useState, useMemo } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { DeviceTable } from '../components/table/DeviceTable';
import { StatusBadge } from '../components/table/StatusBadge';
import { TableToolbar } from '../components/table/TableToolbar';
import { useDiagStore } from '../stores/diagStore';
import { useFilteredData } from '../hooks/useTableFilters';
import { useNavigate } from 'react-router-dom';
import type { AppDeployment } from '../types/diagReport.types';

export function AppDeploymentPage() {
  const isLoaded = useDiagStore((s) => s.isLoaded);
  const appDeployments = useDiagStore((s) => s.appDeployments);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useFilteredData(
    appDeployments,
    { searchTerm, statusFilter, typeFilter },
    ['name', 'publisher', 'version'] as (keyof AppDeployment)[],
    'installState' as keyof AppDeployment,
    'type' as keyof AppDeployment
  );

  const statusOptions = useMemo(
    () => [...new Set(appDeployments.map((a) => a.installState))],
    [appDeployments]
  );

  const typeOptions = useMemo(
    () => [...new Set(appDeployments.map((a) => a.type).filter(Boolean))],
    [appDeployments]
  );

  const columns = [
    { key: 'name' as const, label: 'App-Name' },
    { key: 'publisher' as const, label: 'Herausgeber' },
    { key: 'version' as const, label: 'Version' },
    { key: 'type' as const, label: 'Typ' },
    {
      key: 'installState' as const,
      label: 'Status',
      render: (val: unknown) => <StatusBadge status={String(val)} />,
    },
  ];

  if (!isLoaded) {
    return (
      <div>
        <TopBar title="App-Deployments" />
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 space-y-4">
          <span className="text-5xl">📦</span>
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
        title="App-Deployments"
        subtitle={`${appDeployments.length} Apps gefunden`}
      />
      <div className="p-6 space-y-4">
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptions}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          typeOptions={typeOptions}
          resultCount={filtered.length}
        />
        <DeviceTable data={filtered} columns={columns} />
      </div>
    </div>
  );
}
