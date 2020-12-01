import pino = require('pino');

export const Logger = pino({ prettyPrint: { translateTime: true }, base: null }); // todo change instanse
