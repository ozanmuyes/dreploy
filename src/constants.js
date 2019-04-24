'use strict';

const path = require('path');

const CONSTANTS = {
  CONFIG_FILENAME: '.dreployrc.json',
  DEPLOYMENT_FILENAME: 'deployment.json',
  // From https://stackoverflow.com/a/26227660/250453
  USER_DATA_DIR: (process.env.APPDATA || (process.platform === 'darwin' ? `${process.env.HOME}Library/Preferences` : `${process.env.HOME}/.local/share`)),
  DEFAULT_GLOBAL_CONFIG: Object.freeze({
    logLevel: 4,
    maxUpLevelToProjectRoot: 0,
    // TODO
  }),
  DEFAULT_TARGET_FILE: Object.freeze({
    local: {
      files: [],
    },
    remote: {
      host: '127.0.0.1',
      port: 22,
      username: '',
      password: '',
      path: '',
    },
    // TODO
  }),
  //
};

const CALCULATEDS = {
  GLOBAL_CONFIG_FILEPATH: path.join(CONSTANTS.USER_DATA_DIR, CONSTANTS.CONFIG_FILENAME)
  //
};

module.exports = Object.freeze(Object.assign({}, CONSTANTS, CALCULATEDS));
