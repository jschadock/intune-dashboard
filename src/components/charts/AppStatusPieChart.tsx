import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RECHARTS_DARK_THEME } from '../../utils/colorPalette';
import { ChartCard } from './ChartCard';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface AppStatusPieChartProps {
  data: DataItem[];
  title: string;
}

export function AppStatusPieChart({ data, title }: AppStatusPieChartProps) {
  if (data.length === 0) {
    return (
      <ChartCard title={title}>
        <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
          Keine Daten verfügbar
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={RECHARTS_DARK_THEME.tooltip.contentStyle}
            formatter={(value: number) => [value, 'Anzahl']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span className="text-gray-400 text-xs">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
