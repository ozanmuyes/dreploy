'use strict';

/* eslint-disable no-console */

const chalk = require('chalk');

const PRIV = Symbol('Logger.inst');

/* eslint-disable no-unused-vars */
const LOG_LEVEL_FATAL = 1;
const LOG_LEVEL_ERROR = 2;
const LOG_LEVEL_WARN = 3;
const LOG_LEVEL_INFO = 4;
const LOG_LEVEL_DEBUG = 5;
/* eslint-enable no-unused-vars */

class Logger {
  constructor(logLevel = undefined) {
    if (logLevel === undefined) {
      throw new Error('Log level must be given on Logger instantiation.');
    }

    if (typeof logLevel !== 'number') {
      throw new TypeError('Log level must be a number.');
    }

    this[PRIV] = {
      prvLogLevel: 0,
    };
    this.logLevel = logLevel;
  }

  get logLevel() {
    return this[PRIV].prvLogLevel;
  }

  set logLevel(newVal) {
    let normalizedLogLevel = newVal;
    if (normalizedLogLevel < 1) {
      normalizedLogLevel = 1;
    } else if (normalizedLogLevel > 5) {
      normalizedLogLevel = 5;
    }

    this[PRIV].prvLogLevel = normalizedLogLevel;
  }

  fatal(message) {
    if (LOG_LEVEL_FATAL <= this[PRIV].prvLogLevel) {
      console.log(chalk.bgRed(`FATAL: ${message}`));
    }
  }

  error(message) {
    if (LOG_LEVEL_ERROR <= this[PRIV].prvLogLevel) {
      console.log(chalk.red(`ERROR: ${message}`));
    }
  }

  warn(message) {
    if (LOG_LEVEL_WARN <= this[PRIV].prvLogLevel) {
      console.log(chalk.yellow(`WARNING: ${message}`));
    }
  }

  info(message) {
    if (LOG_LEVEL_INFO <= this[PRIV].prvLogLevel) {
      console.log(chalk.cyan(`INFO: ${message}`));
    }
  }

  log(message) {
    if (LOG_LEVEL_INFO <= this[PRIV].prvLogLevel) {
      console.log(message);
    }
  }

  debug(message) {
    if (LOG_LEVEL_DEBUG <= this[PRIV].prvLogLevel) {
      console.log(chalk.gray(`DEBUG: ${message}`));
    }
  }
}

module.exports = {
  LOG_LEVEL_FATAL,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_WARN,
  LOG_LEVEL_INFO,
  LOG_LEVEL_DEBUG,
  Logger,
};
