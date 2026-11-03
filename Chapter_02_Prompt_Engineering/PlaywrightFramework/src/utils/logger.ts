type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

function write(level: LogLevel, message: string): void {
  const line = `[${new Date().toISOString()}] [${level}] ${message}`;
  if (level === 'ERROR') {
    console.error(line);
    return;
  }
  console.log(line);
}

export const logger = {
  info(message: string): void {
    write('INFO', message);
  },
  warn(message: string): void {
    write('WARN', message);
  },
  error(message: string): void {
    write('ERROR', message);
  },
  debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      write('DEBUG', message);
    }
  },
};
