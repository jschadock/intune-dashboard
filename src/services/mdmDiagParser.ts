import type { DeviceInfo, ConfigProfile, AppDeployment } from '../types/diagReport.types';

function getTextContent(parent: Element | Document, tag: string): string {
  return parent.querySelector(tag)?.textContent?.trim() ?? '';
}

function getAllTextContent(el: Element, tag: string): string {
  return el.querySelector(tag)?.textContent?.trim() ?? '';
}

export function parseDeviceInfo(doc: Document): DeviceInfo | null {
  // Try multiple known XML structures
  const deviceInfoEl =
    doc.querySelector('DeviceInfo') ??
    doc.querySelector('MDMDeviceInfo') ??
    doc.querySelector('DeviceInformation');

  if (!deviceInfoEl) return null;

  return {
    computerName:
      getAllTextContent(deviceInfoEl, 'ComputerName') ||
      getAllTextContent(deviceInfoEl, 'DeviceName') ||
      getTextContent(doc, 'ComputerName') ||
      'Unbekannt',
    osVersion:
      getAllTextContent(deviceInfoEl, 'OSVersion') ||
      getAllTextContent(deviceInfoEl, 'OsVersion') ||
      '',
    enrollmentType:
      getAllTextContent(deviceInfoEl, 'EnrollmentType') ||
      getAllTextContent(deviceInfoEl, 'MDMEnrollmentType') ||
      '',
    mdmDeviceId:
      getTextContent(doc, 'MDMDeviceID') ||
      getTextContent(doc, 'DeviceId') ||
      '',
    tenantId:
      getTextContent(doc, 'TenantID') ||
      getTextContent(doc, 'TenantId') ||
      '',
    enrollmentDate:
      getTextContent(doc, 'EnrollmentDate') ||
      getTextContent(doc, 'EnrollDate') ||
      '',
    lastSyncTime:
      getTextContent(doc, 'LastSyncTime') ||
      getTextContent(doc, 'LastSync') ||
      '',
  };
}

function normalizeStatus(raw: string): ConfigProfile['status'] {
  const lower = raw.toLowerCase();
  if (lower.includes('applied') || lower.includes('success') || lower.includes('compliant')) return 'Applied';
  if (lower.includes('pending') || lower.includes('queued')) return 'Pending';
  if (lower.includes('fail') || lower.includes('error') || lower.includes('conflict')) return 'Failed';
  return 'Unknown';
}

export function parseConfigProfiles(doc: Document): ConfigProfile[] {
  const profiles: ConfigProfile[] = [];

  // Try various known XML structures for policies/configs
  const policyNodes = doc.querySelectorAll(
    'Policy, ConfigurationPolicy, DeviceConfigurationPolicy, MDMConfigurationPolicy'
  );

  policyNodes.forEach((node) => {
    profiles.push({
      name:
        getAllTextContent(node, 'PolicyName') ||
        getAllTextContent(node, 'Name') ||
        getAllTextContent(node, 'DisplayName') ||
        'Unbenannte Policy',
      type:
        getAllTextContent(node, 'PolicyType') ||
        getAllTextContent(node, 'Type') ||
        '',
      source:
        getAllTextContent(node, 'ConfigurationSource') ||
        getAllTextContent(node, 'Source') ||
        'MDM',
      status: normalizeStatus(
        getAllTextContent(node, 'Status') ||
        getAllTextContent(node, 'State') ||
        getAllTextContent(node, 'ComplianceState') ||
        ''
      ),
      lastApplied:
        getAllTextContent(node, 'LastApplied') ||
        getAllTextContent(node, 'LastModified') ||
        getAllTextContent(node, 'Timestamp') ||
        '',
      details:
        getAllTextContent(node, 'Details') ||
        getAllTextContent(node, 'ErrorMessage') ||
        '',
    });
  });

  // Also check for CSP nodes (Configuration Service Provider) common in MDM diags
  const cspNodes = doc.querySelectorAll('CSP, ConfigurationServiceProvider');
  cspNodes.forEach((node) => {
    const name = getAllTextContent(node, 'Name') || node.getAttribute('name') || '';
    if (!name) return;
    profiles.push({
      name,
      type: 'CSP',
      source: 'MDM',
      status: normalizeStatus(getAllTextContent(node, 'Status') || getAllTextContent(node, 'State') || ''),
      lastApplied: getAllTextContent(node, 'LastModified') || '',
      details: '',
    });
  });

  return profiles;
}

function normalizeInstallState(raw: string): AppDeployment['installState'] {
  const lower = raw.toLowerCase();
  if (lower.includes('installed') || lower.includes('success')) return 'Installed';
  if (lower.includes('fail') || lower.includes('error')) return 'Failed';
  if (lower.includes('pending') || lower.includes('queued') || lower.includes('downloading')) return 'Pending';
  if (lower.includes('not') || lower.includes('unavailable')) return 'NotInstalled';
  return 'Unknown';
}

export function parseAppDeployments(doc: Document): AppDeployment[] {
  const apps: AppDeployment[] = [];

  // Win32 Apps
  const win32Nodes = doc.querySelectorAll(
    'Win32AppInventory App, Win32App, MobileApp'
  );
  win32Nodes.forEach((node) => {
    apps.push({
      name:
        getAllTextContent(node, 'Name') ||
        getAllTextContent(node, 'DisplayName') ||
        'Unbekannte App',
      publisher: getAllTextContent(node, 'Publisher') || '',
      version: getAllTextContent(node, 'Version') || '',
      installState: normalizeInstallState(
        getAllTextContent(node, 'InstallState') ||
        getAllTextContent(node, 'Status') ||
        getAllTextContent(node, 'State') ||
        ''
      ),
      type: 'Win32',
    });
  });

  // Store Apps
  const storeNodes = doc.querySelectorAll(
    'StoreAppInventory App, StoreApp'
  );
  storeNodes.forEach((node) => {
    apps.push({
      name:
        getAllTextContent(node, 'Name') ||
        getAllTextContent(node, 'DisplayName') ||
        'Unbekannte App',
      publisher: getAllTextContent(node, 'Publisher') || '',
      version: getAllTextContent(node, 'Version') || '',
      installState: normalizeInstallState(
        getAllTextContent(node, 'InstallState') ||
        getAllTextContent(node, 'Status') ||
        ''
      ),
      type: 'Store',
    });
  });

  // Generic App nodes
  const genericAppNodes = doc.querySelectorAll('Application, InstalledApp, DetectedApp');
  genericAppNodes.forEach((node) => {
    const name = getAllTextContent(node, 'Name') || getAllTextContent(node, 'DisplayName') || '';
    if (!name || apps.some((a) => a.name === name)) return;
    apps.push({
      name,
      publisher: getAllTextContent(node, 'Publisher') || '',
      version: getAllTextContent(node, 'Version') || '',
      installState: normalizeInstallState(
        getAllTextContent(node, 'InstallState') ||
        getAllTextContent(node, 'Status') ||
        ''
      ),
      type: 'Unknown',
    });
  });

  return apps;
}

export function parseMDMDiagReport(xmlString: string): {
  deviceInfo: DeviceInfo | null;
  configProfiles: ConfigProfile[];
  appDeployments: AppDeployment[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    console.warn('XML parse error, trying as HTML fallback');
    const htmlDoc = parser.parseFromString(xmlString, 'text/html');
    return {
      deviceInfo: parseDeviceInfo(htmlDoc),
      configProfiles: parseConfigProfiles(htmlDoc),
      appDeployments: parseAppDeployments(htmlDoc),
    };
  }

  return {
    deviceInfo: parseDeviceInfo(doc),
    configProfiles: parseConfigProfiles(doc),
    appDeployments: parseAppDeployments(doc),
  };
}
