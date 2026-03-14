import { useCallback } from 'react';
import { extractAndParse } from '../services/zipExtractor';
import { useDiagStore } from '../stores/diagStore';
import { useUploadStore } from '../stores/uploadStore';

export function useZipUpload() {
  const setReport = useDiagStore((s) => s.setReport);
  const resetDiag = useDiagStore((s) => s.reset);
  const { setUploading, setProgress, setError, setFileName, reset: resetUpload } = useUploadStore();

  const upload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.zip')) {
        setError('Bitte eine ZIP-Datei hochladen.');
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
            setError('Die ZIP-Datei ist leer.');
          }
        }

        setReport(report);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unbekannter Fehler beim Verarbeiten der Datei.';
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [setReport, resetDiag, setUploading, setProgress, setError, setFileName, resetUpload]
  );

  return { upload };
}
