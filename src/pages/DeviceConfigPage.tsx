import { useState, useMemo } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { DeviceTable } from '../components/table/DeviceTable';
import { StatusBadge } from '../components/table/StatusBadge';
import { TableToolbar } from '../components/table/TableToolbar';
import { useDiagStore } from '../stores/diagStore';
import { useFilteredData } from '../hooks/useTableFilters';
import { useNavigate } from 'react-router-dom';
import type { ConfigProfile } from '../types/diagReport.types';

export function DeviceConfigPage() {
  const isLoaded = useDiagStore((s) => s.isLoaded);
  const configProfiles = useDiagStore((s) => s.configProfiles);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useFilteredData(
    configProfiles,
    { searchTerm, statusFilter, typeFilter },
    ['name', 'source', 'details'] as (keyof ConfigProfile)[],
    'status' as keyof ConfigProfile,
    'type' as keyof ConfigProfile
  );

  const statusOptions = useMemo(
    () => [...new Set(configProfiles.map((p) => p.status))],
    [configProfiles]
  );

  const typeOptions = useMemo(
    () => [...new Set(configProfiles.map((p) => p.type).filter(Boolean))],
    [configProfiles]
  );

  const columns = [
    { key: 'name' as const, label: 'Policy-Name' },
    { key: 'type' as const, label: 'Typ' },
    { key: 'source' as const, label: 'Quelle' },
    {
      key: 'status' as const,
      label: 'Status',
      render: (val: unknown) => <StatusBadge status={String(val)} />,
    },
    { key: 'lastApplied' as const, label: 'Zuletzt angewendet' },
    { key: 'details' as const, label: 'Details' },
  ];

  if (!isLoaded) {
    return (
      <div>
        <TopBar title="Konfigurationsprofile" />
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 space-y-4">
          <span className="text-5xl">⚙️</span>
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
        title="Konfigurationsprofile"
        subtitle={`${configProfiles.length} Profile gefunden`}
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
