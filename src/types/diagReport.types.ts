export interface DeviceInfo {
  computerName: string;
  osVersion: string;
  enrollmentType: string;
  mdmDeviceId: string;
  tenantId: string;
  enrollmentDate: string;
  lastSyncTime: string;
}

export interface ConfigProfile {
  name: string;
  type: string;
  source: string;
  status: 'Applied' | 'Pending' | 'Failed' | 'Unknown';
  lastApplied: string;
  details: string;
}

export interface AppDeployment {
  name: string;
  publisher: string;
  version: string;
  installState: 'Installed' | 'Failed' | 'NotInstalled' | 'Pending' | 'Unknown';
  type: 'Win32' | 'Store' | 'LOB' | 'Unknown';
}

export interface ZipFileEntry {
  name: string;
  path: string;
  size: number;
  extension: string;
  category: 'xml' | 'html' | 'log' | 'reg' | 'etl' | 'evtx' | 'other';
  parsed: boolean;
  content?: string;
}

export interface DiagReport {
  deviceInfo: DeviceInfo | null;
  configProfiles: ConfigProfile[];
  appDeployments: AppDeployment[];
  files: ZipFileEntry[];
  logFiles: { name: string; content: string }[];
  rawXml: string | null;
}
