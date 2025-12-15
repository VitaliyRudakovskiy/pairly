import { Injectable, signal } from '@angular/core';

// разновидности логов
export enum LogEnum {
  DEBUG = 0,
  INFO = 1,
  ERROR = 2,
}

export interface LogEntry {
  message: unknown;
  timestamp: Date;
  type: LogEnum;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logs = signal<LogEntry[]>([]);

  debug(message: unknown): void {
    console.log('[DEBUGGING]', message);

    this.logs.update((old) => [...old, { message, timestamp: new Date(), type: LogEnum.DEBUG }]);
  }

  info(message: unknown): void {
    console.warn('[SOME_INFO]', message);

    this.logs.update((old) => [...old, { message, timestamp: new Date(), type: LogEnum.INFO }]);
  }

  error(message: unknown): void {
    console.error('[ERROR OCCURED]', message);

    this.logs.update((old) => [...old, { message, timestamp: new Date(), type: LogEnum.ERROR }]);
  }

  getLogsHistory(): LogEntry[] {
    return [...this.logs()];
  }

  clearHistory(): void {
    this.logs.set([]);
  }
}
