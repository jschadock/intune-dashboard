import { TopBar } from '../components/layout/TopBar';
import { DropZone } from '../components/upload/DropZone';
import { FileInventory } from '../components/upload/FileInventory';
import { useDiagStore } from '../stores/diagStore';

export function UploadPage() {
  const isLoaded = useDiagStore((s) => s.isLoaded);
  const deviceInfo = useDiagStore((s) => s.deviceInfo);

  return (
    <div>
      <TopBar
        title="Diagnosepaket hochladen"
        subtitle="Laden Sie ein Intune-Diagnosepaket (.zip) hoch"
      />
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <DropZone />

        {isLoaded && (
          <>
            {deviceInfo && (
              <div className="bg-surface-900 border border-gray-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Geräteinformationen</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Computer</span>
                    <p className="text-gray-300 font-mono">{deviceInfo.computerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">OS-Version</span>
                    <p className="text-gray-300 font-mono">{deviceInfo.osVersion || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Enrollment-Typ</span>
                    <p className="text-gray-300 font-mono">{deviceInfo.enrollmentType || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">MDM Device ID</span>
                    <p className="text-gray-300 font-mono text-xs truncate">{deviceInfo.mdmDeviceId || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tenant ID</span>
                    <p className="text-gray-300 font-mono text-xs truncate">{deviceInfo.tenantId || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Letzter Sync</span>
                    <p className="text-gray-300 font-mono">{deviceInfo.lastSyncTime || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            <FileInventory />
          </>
        )}
      </div>
    </div>
  );
}
