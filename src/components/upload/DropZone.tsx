import { useCallback, useRef, useState } from 'react';
import { useZipUpload } from '../../hooks/useZipUpload';
import { useUploadStore } from '../../stores/uploadStore';

export function DropZone() {
  const { upload } = useZipUpload();
  const isUploading = useUploadStore((s) => s.isUploading);
  const progress = useUploadStore((s) => s.progress);
  const error = useUploadStore((s) => s.error);
  const errorHint = useUploadStore((s) => s.errorHint);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      upload(file);
    },
    [upload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center
          border-2 border-dashed rounded-xl p-12 cursor-pointer
          transition-all duration-200
          ${isDragOver
            ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
            : 'border-gray-700 bg-surface-900 hover:border-gray-600 hover:bg-surface-800'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          onChange={onFileSelect}
          className="hidden"
        />

        {isUploading && progress ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">{progress.step}</p>
            <div className="w-48 h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {progress.current} / {progress.total} Dateien
            </p>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="text-5xl">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-300">
                Intune-Diagnosepaket hochladen
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ZIP-Datei hierher ziehen oder klicken zum Auswählen
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="px-2 py-0.5 bg-surface-700 rounded">.zip</span>
              <span>Intune Diagnosepaket</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <span className="text-red-400 text-lg">⚠</span>
            <div>
              <p className="text-sm font-medium text-red-400">Fehler beim Verarbeiten</p>
              <p className="text-sm text-red-400/70 mt-0.5">{error}</p>
            </div>
          </div>
          {errorHint && (
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <span className="text-blue-400 text-base">💡</span>
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-0.5">Lösung</p>
                <p className="text-sm text-blue-300/80">{errorHint}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
