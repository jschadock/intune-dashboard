export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'UNKNOWN';
  message: string;
  lineNumber: number;
}

const LOG_PATTERNS = [
  // Common patterns: [2024-01-15 10:30:00] ERROR: message
  /^\[?(\d{4}[-/]\d{2}[-/]\d{2}[\sT]\d{2}:\d{2}:\d{2}[^\]]*)\]?\s*(INFO|WARN(?:ING)?|ERROR|DEBUG|VERBOSE|TRACE)[\s:]+(.+)/i,
  // Windows-style: 2024-01-15 10:30:00 ERROR message
  /^(\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?)\s+(INFO|WARN(?:ING)?|ERROR|DEBUG|VERBOSE)[\s:]+(.+)/i,
  // ISO timestamp at start
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[^\s]*)\s+(INFO|WARN|ERROR|DEBUG)[\s:]+(.+)/i,
];

export function parseLogContent(content: string): LogEntry[] {
  const lines = content.split('\n');
  return lines
    .map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      for (const pattern of LOG_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match) {
          const levelRaw = match[2].toUpperCase();
          let level: LogEntry['level'] = 'UNKNOWN';
          if (levelRaw.startsWith('INFO')) level = 'INFO';
          else if (levelRaw.startsWith('WARN')) level = 'WARN';
          else if (levelRaw.startsWith('ERR')) level = 'ERROR';
          else if (levelRaw.startsWith('DEBUG') || levelRaw === 'VERBOSE' || levelRaw === 'TRACE') level = 'DEBUG';

          return { timestamp: match[1], level, message: match[3], lineNumber: idx + 1 };
        }
      }

      return { timestamp: '', level: 'UNKNOWN' as const, message: trimmed, lineNumber: idx + 1 };
    })
    .filter((entry): entry is LogEntry => entry !== null);
}
