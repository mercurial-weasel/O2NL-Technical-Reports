type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: object;
}

class Logger {
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private level: LogLevel = 'info';
  private static instance: Logger;
  private logHistory: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLogHistory(): LogEntry[] {
    return this.logHistory;
  }

  clearHistory(): void {
    this.logHistory = [];
  }

  debug(message: string, meta?: object): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: object): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: object): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: object): void {
    this.log('error', message, meta);
  }

  private log(level: LogLevel, message: string, meta?: object): void {
    if (this.levels[level] >= this.levels[this.level]) {
      const timestamp = new Date().toISOString();
      const logEntry: LogEntry = {
        timestamp,
        level,
        message,
        ...(meta && { meta })
      };

      // Store in history
      this.logHistory.push(logEntry);

      // Console output with color
      const coloredLevel = this.getColoredLevel(level);
      console[level === 'error' ? 'error' : 'log'](
        `${timestamp} ${coloredLevel}: ${message}${meta ? ' ' + JSON.stringify(meta) : ''}`
      );
    }
  }

  private getColoredLevel(level: LogLevel): string {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';
    return `${colors[level]}${level.toUpperCase()}${reset}`;
  }
}

export const logger = Logger.getInstance();