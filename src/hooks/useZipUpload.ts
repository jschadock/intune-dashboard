import { useCallback } from 'react';
import { extractAndParse } from '../services/zipExtractor';
import { useDiagStore } from '../stores/diagStore';
import { useUploadStore } from '../stores/uploadStore';

function resolveErrorHint(err: unknown): string {
  const msg = err instanceof Error ? err.message.toLowerCase() : '';

  if (msg.includes('corrupted') || msg.includes('invalid') || msg.includes('bad local file header')) {
    return 'Die ZIP-Datei ist beschädigt. Lade das Diagnosepaket erneut aus der Intune-Konsole herunter und versuche es nochmals.';
  }
  if (msg.includes('password') || msg.includes('encrypted')) {
    return 'Die ZIP-Datei ist passwortgeschützt. Intune-Diagnosepakete benötigen kein Passwort – bitte exportiere die Datei erneut.';
  }
  if (msg.includes('memory') || msg.includes('out of')) {
    return 'Die Datei ist zu groß, um sie im Browser zu verarbeiten. Versuche, eine kleinere Diagnosedatei hochzuladen.';
  }
  return 'Stelle sicher, dass die Datei ein gültiges Intune-Diagnosepaket ist (exportiert über Intune → Geräte → Diagnose sammeln).';
}

export function useZipUpload() {
  const setReport = useDiagStore((s) => s.setReport);
  const resetDiag = useDiagStore((s) => s.reset);
  const { setUploading, setProgress, setError, setFileName, reset: resetUpload } = useUploadStore();

  const upload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.zip')) {
        setError(
          'Ungültiges Dateiformat – nur ZIP-Dateien werden unterstützt.',
          'Exportiere das Diagnosepaket direkt in der Intune-Verwaltungskonsole: Geräte → Gerät auswählen → „Diagnose sammeln". Die heruntergeladene Datei hat automatisch das richtige Format.'
        );
        return;
      }

      resetUpload();
      resetDiag();
      setUploading(true);
      setFileName(file.name);
      setError(null);

      try {
        const report = await extractAndParse(file, (step, current, total) => {
          setProgress(step, current, total);
        });

        if (!report.deviceInfo && report.configProfiles.length === 0 && report.appDeployments.length === 0) {
          if (report.files.length === 0) {
            setError(
              'Die ZIP-Datei ist leer.',
              'Stelle sicher, dass du die vollständige Diagnosedatei hochlädst. Ein gültiges Intune-Paket enthält u. a. die Datei MDMDiagReport.xml.'
            );
          }
        }

        setReport(report);
      } catch (err) {
        const hint = resolveErrorHint(err);
        const message = err instanceof Error ? err.message : 'Unbekannter Fehler beim Verarbeiten der Datei.';
        setError(message, hint);
      } finally {
        setUploading(false);
      }
    },
    [setReport, resetDiag, setUploading, setProgress, setError, setFileName, resetUpload]
  );

  return { upload };
}
