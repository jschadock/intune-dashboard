import type { AppDeployment, ConfigProfile } from '../types/diagReport.types';

export interface IntuneHint {
  text: string;
  link?: { label: string; path: string };
}

export function getAppHint(app: AppDeployment): IntuneHint | null {
  switch (app.installState) {
    case 'Failed':
      if (app.type === 'Win32') {
        return {
          text: 'Detection Rule prüfen: Erkennt Intune die App nach der Installation nicht, wird sie erneut deployt und schlägt fehl. Passe die Erkennungsregel an (Intune → Apps → App auswählen → Eigenschaften → Erkennungsregeln).',
        };
      }
      if (app.type === 'Store') {
        return {
          text: 'Prüfe ob das Gerät Zugriff auf den Microsoft Store hat und die Store-Lizenz korrekt zugewiesen ist. Ggf. Store-Konnektivität und Proxy-Einstellungen kontrollieren.',
        };
      }
      if (app.type === 'LOB') {
        return {
          text: 'Prüfe das Installationspaket auf Signatur-Fehler (LOB-Apps müssen signiert sein). Kontrolliere die Installationslogs unter C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\.',
        };
      }
      return {
        text: 'Installationsfehler: Prüfe die IME-Logs unter C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\ und kontrolliere ob alle App-Anforderungen (Abhängigkeiten, Architektur) erfüllt sind.',
      };

    case 'NotInstalled':
      return {
        text: 'App wurde nicht als installiert erkannt. Häufige Ursache: Detection Rule stimmt nicht mit der tatsächlichen Installation überein. Passe die Erkennungsregel an (Datei, Registry-Schlüssel oder MSI-Produkt-Code) unter Intune → Apps → App auswählen → Eigenschaften.',
      };

    case 'Pending':
      return {
        text: 'Installation ausstehend. Erzwinge eine Synchronisierung: Einstellungen → Konten → Auf Geschäfts-/Schulkonto zugreifen → Konto auswählen → Synchronisieren. Alternativ: Unternehmensporal-App öffnen.',
      };

    default:
      return null;
  }
}

export function getProfileHint(profile: ConfigProfile): IntuneHint | null {
  switch (profile.status) {
    case 'Failed':
      return {
        text: 'Profil konnte nicht angewendet werden. Mögliche Ursachen: Konflikt mit einem anderen Profil, fehlende Berechtigungen oder nicht unterstützte Einstellung für diese OS-Version. Prüfe unter Intune → Geräte → Konfiguration → Profil auswählen → Gerätestatus die genaue Fehlermeldung.',
      };

    case 'Pending':
      return {
        text: 'Profil noch nicht angewendet. Erzwinge einen Check-in (Einstellungen → Konten → Synchronisieren) oder warte bis zu 8 Stunden auf den nächsten automatischen Intune-Check-in-Zyklus.',
      };

    default:
      return null;
  }
}
