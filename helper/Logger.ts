import { default as pino } from 'pino';

export const Logger = pino({ prettyPrint: { translateTime: true }, base: null }); // todo change instanse
