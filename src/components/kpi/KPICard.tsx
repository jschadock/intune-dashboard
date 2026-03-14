interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
}

const colorMap = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  gray: 'text-gray-400',
};

export function KPICard({ title, value, subtitle, color = 'blue' }: KPICardProps) {
  return (
    <div className="bg-surface-900 border border-gray-800 rounded-xl p-5 space-y-2">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-surface-900 border border-gray-800 rounded-xl p-5 space-y-3 animate-pulse">
      <div className="h-4 w-24 bg-surface-700 rounded" />
      <div className="h-9 w-20 bg-surface-700 rounded" />
      <div className="h-3 w-32 bg-surface-700 rounded" />
    </div>
  );
}
