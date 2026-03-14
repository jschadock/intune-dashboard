export const STATUS_COLORS = {
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  pending: '#3b82f6',
  neutral: '#6b7280',
} as const;

export const CHART_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#ef4444',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
] as const;

export const RECHARTS_DARK_THEME = {
  grid: { stroke: '#374151' },
  axis: { fill: '#9ca3af', fontSize: 12 },
  tooltip: {
    contentStyle: {
      backgroundColor: '#1a1a24',
      border: '1px solid #374151',
      borderRadius: '8px',
      color: '#e5e7eb',
    },
  },
} as const;
