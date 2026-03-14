import { NavLink } from 'react-router-dom';
import { useDiagStore } from '../../stores/diagStore';
import { formatDate } from '../../utils/dateUtils';

const navItems = [
  { to: '/', label: 'Upload', icon: '📂' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/config', label: 'Konfiguration', icon: '⚙️' },
  { to: '/apps', label: 'App-Deployments', icon: '📦' },
  { to: '/logs', label: 'Rohdaten', icon: '📄' },
];

export function Sidebar() {
  const deviceInfo = useDiagStore((s) => s.deviceInfo);
  const isLoaded = useDiagStore((s) => s.isLoaded);

  return (
    <aside className="w-60 bg-surface-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white tracking-tight">
          Intune Dashboard
        </h1>
        <p className="text-xs text-gray-500 mt-1">Log-Analyse & Auswertung</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 font-medium'
                  : 'text-gray-400 hover:bg-surface-800 hover:text-gray-200'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {isLoaded && deviceInfo && (
        <div className="p-4 border-t border-gray-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-400">Daten geladen</span>
          </div>
          <p className="text-gray-500 truncate" title={deviceInfo.computerName}>
            {deviceInfo.computerName}
          </p>
          {deviceInfo.lastSyncTime && (
            <p className="text-gray-600">
              Sync: {formatDate(deviceInfo.lastSyncTime)}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
