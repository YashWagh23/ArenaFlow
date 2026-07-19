type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const isDev = process.env.NODE_ENV !== 'production';

function log(level: LogLevel, module: string, message: string, meta?: Record<string, unknown>): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    module,
    message,
    ...(meta && { meta }),
  };
  const output = JSON.stringify(entry);
  if (level === 'ERROR') {
    process.stderr.write(output + '\n');
  } else {
    process.stdout.write(output + '\n');
  }
}

export function createLogger(module: string) {
  return {
    info: (message: string, meta?: Record<string, unknown>) =>
      log('INFO', module, message, meta),
    warn: (message: string, meta?: Record<string, unknown>) =>
      log('WARN', module, message, meta),
    error: (message: string, meta?: Record<string, unknown>) =>
      log('ERROR', module, message, meta),
    debug: (message: string, meta?: Record<string, unknown>) => {
      if (isDev) log('DEBUG', module, message, meta);
    },
  };
}

export type Logger = ReturnType<typeof createLogger>;
