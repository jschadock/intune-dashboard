import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { RECHARTS_DARK_THEME } from '../../utils/colorPalette';
import { ChartCard } from './ChartCard';
import type { ConfigProfile } from '../../types/diagReport.types';

interface ProfileComplianceBarProps {
  profiles: ConfigProfile[];
}

export function ProfileComplianceBar({ profiles }: ProfileComplianceBarProps) {
  if (profiles.length === 0) {
    return (
      <ChartCard title="Konfigurationsprofile – Status">
        <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
          Keine Konfigurationsprofile gefunden
        </div>
      </ChartCard>
    );
  }

  // Group by source or type and count statuses
  const grouped = profiles.reduce(
    (acc, p) => {
      const key = p.type || p.source || 'Sonstige';
      if (!acc[key]) acc[key] = { name: key, Applied: 0, Failed: 0, Pending: 0, Unknown: 0 };
      acc[key][p.status]++;
      return acc;
    },
    {} as Record<string, { name: string; Applied: number; Failed: number; Pending: number; Unknown: number }>
  );

  const data = Object.values(grouped).slice(0, 10); // Max 10 bars

  return (
    <ChartCard title="Konfigurationsprofile – Status nach Typ">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={RECHARTS_DARK_THEME.grid.stroke} horizontal={false} />
          <XAxis type="number" tick={{ ...RECHARTS_DARK_THEME.axis }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ ...RECHARTS_DARK_THEME.axis }}
            width={100}
          />
          <Tooltip contentStyle={RECHARTS_DARK_THEME.tooltip.contentStyle} />
          <Legend
            formatter={(value: string) => (
              <span className="text-gray-400 text-xs">{value === 'Applied' ? 'Angewendet' : value === 'Failed' ? 'Fehlgeschlagen' : value === 'Pending' ? 'Ausstehend' : 'Unbekannt'}</span>
            )}
          />
          <Bar dataKey="Applied" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Failed" stackId="a" fill="#ef4444" />
          <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Unknown" stackId="a" fill="#6b7280" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
