import { create } from 'zustand';
import type { DiagReport, DeviceInfo, ConfigProfile, AppDeployment, ZipFileEntry } from '../types/diagReport.types';

interface DiagState {
  deviceInfo: DeviceInfo | null;
  configProfiles: ConfigProfile[];
  appDeployments: AppDeployment[];
  files: ZipFileEntry[];
  logFiles: { name: string; content: string }[];
  rawXml: string | null;
  isLoaded: boolean;

  setReport: (report: DiagReport) => void;
  reset: () => void;
}

export const useDiagStore = create<DiagState>((set) => ({
  deviceInfo: null,
  configProfiles: [],
  appDeployments: [],
  files: [],
  logFiles: [],
  rawXml: null,
  isLoaded: false,

  setReport: (report) =>
    set({
      deviceInfo: report.deviceInfo,
      configProfiles: report.configProfiles,
      appDeployments: report.appDeployments,
      files: report.files,
      logFiles: report.logFiles,
      rawXml: report.rawXml,
      isLoaded: true,
    }),

  reset: () =>
    set({
      deviceInfo: null,
      configProfiles: [],
      appDeployments: [],
      files: [],
      logFiles: [],
      rawXml: null,
      isLoaded: false,
    }),
}));
