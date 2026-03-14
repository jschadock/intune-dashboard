import JSZip from 'jszip';
import type { ZipFileEntry, DiagReport } from '../types/diagReport.types';
import { parseMDMDiagReport } from './mdmDiagParser';
import { parseLogContent } from './logFileParser';

function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

function categorize(ext: string): ZipFileEntry['category'] {
  if (ext === 'xml') return 'xml';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'log' || ext === 'txt') return 'log';
  if (ext === 'reg') return 'reg';
  if (ext === 'etl') return 'etl';
  if (ext === 'evtx') return 'evtx';
  return 'other';
}

export async function extractAndParse(
  file: File,
  onProgress?: (step: string, current: number, total: number) => void
): Promise<DiagReport> {
  onProgress?.('ZIP wird geladen...', 0, 1);
  const zip = await JSZip.loadAsync(file);

  const entries = Object.values(zip.files).filter((f) => !f.dir);
  const total = entries.length;

  const fileList: ZipFileEntry[] = [];
  let mdmXmlContent: string | null = null;
  const logFiles: { name: string; content: string }[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const ext = getExtension(entry.name);
    const category = categorize(ext);
    const baseName = entry.name.split('/').pop() || entry.name;

    onProgress?.(`Verarbeite: ${baseName}`, i + 1, total);

    const fileEntry: ZipFileEntry = {
      name: baseName,
      path: entry.name,
      size: 0,
      extension: ext,
      category,
      parsed: false,
    };

    // Read text-based files
    if (['xml', 'html', 'log', 'reg'].includes(category)) {
      try {
        const content = await entry.async('string');
        fileEntry.size = content.length;
        fileEntry.parsed = true;

        // Detect MDMDiagReport.xml (main diagnostic report)
        if (
          category === 'xml' &&
          (baseName.toLowerCase().includes('mdmdiag') ||
            baseName.toLowerCase().includes('mdm_diagnostics') ||
            content.includes('MDMEnterpriseDiagnosticsReport') ||
            content.includes('DeviceManagement'))
        ) {
          mdmXmlContent = content;
        }

        // Collect log and reg files for raw viewer
        if (category === 'log' || category === 'reg') {
          logFiles.push({ name: baseName, content });
        }

        // Also store HTML files in logFiles for viewing
        if (category === 'html') {
          logFiles.push({ name: baseName, content });
        }

        // Store smaller XML files in log viewer too
        if (category === 'xml' && content !== mdmXmlContent) {
          logFiles.push({ name: baseName, content });
        }
      } catch {
        fileEntry.parsed = false;
      }
    } else {
      // Binary files: just show metadata
      try {
        const data = await entry.async('uint8array');
        fileEntry.size = data.length;
      } catch {
        fileEntry.size = 0;
      }
    }

    fileList.push(fileEntry);
  }

  // Parse MDMDiagReport if found
  let deviceInfo = null;
  let configProfiles: DiagReport['configProfiles'] = [];
  let appDeployments: DiagReport['appDeployments'] = [];

  if (mdmXmlContent) {
    onProgress?.('MDM-Report wird analysiert...', total, total);
    const result = parseMDMDiagReport(mdmXmlContent);
    deviceInfo = result.deviceInfo;
    configProfiles = result.configProfiles;
    appDeployments = result.appDeployments;
  }

  return {
    deviceInfo,
    configProfiles,
    appDeployments,
    files: fileList,
    logFiles,
    rawXml: mdmXmlContent,
  };
}

export { parseLogContent };
