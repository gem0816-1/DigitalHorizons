type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const LOG_STORAGE_KEY = 'jishe.runtime.logs';
const MAX_LOG_ENTRIES = 200;

function persistLog(entry: LogEntry): void {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOG_STORAGE_KEY) ?? '[]') as LogEntry[];
    const next = [...parsed, entry].slice(-MAX_LOG_ENTRIES);
    window.localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}

function emit(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  if (level === 'error') {
    console.error(`[${entry.timestamp}] ${message}`, context ?? {});
  } else if (level === 'warn') {
    console.warn(`[${entry.timestamp}] ${message}`, context ?? {});
  } else if (level === 'debug') {
    console.debug(`[${entry.timestamp}] ${message}`, context ?? {});
  } else {
    console.info(`[${entry.timestamp}] ${message}`, context ?? {});
  }

  persistLog(entry);
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => emit('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => emit('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => emit('error', message, context),
  debug: (message: string, context?: Record<string, unknown>) => emit('debug', message, context),
};
