import { join } from 'path';
import { createLogger, transports, format } from 'winston';
import { SETTING_PATH } from './AppSettings';

//export const Logger = pino({ prettyPrint: { translateTime: true }, base: null }); // todo change instanse

const { combine, timestamp, label, printf } = format;
const logFormat = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}] ${label}: ${message}`;
});

// remove old logs
export function logCleaner () {}

export const Logger = createLogger({
    format: format.json(),
    transports: [
        new transports.Console(),
        new transports.File({ filename: join(SETTING_PATH, 'logs', `${new Date().toLocaleString('ja-JP').replace(' ', '-').replaceAll(':', '-').replaceAll('/','_')}.log` )})
    ]
});
