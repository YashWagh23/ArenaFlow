const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;

type LogArgs = [message: string, ...meta: unknown[]];

export const logger = {
  info: (...args: LogArgs): void => {
    if (!isProd) console.info('[AF:info]', ...args);
  },
  warn: (...args: LogArgs): void => {
    console.warn('[AF:warn]', ...args);
  },
  error: (...args: LogArgs): void => {
    console.error('[AF:error]', ...args);
  },
  debug: (...args: LogArgs): void => {
    if (isDev) console.debug('[AF:debug]', ...args);
  },
};
