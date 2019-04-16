'use strict';

const fs = require('fs');

const {
  // CONFIG_FILENAME,
  // USER_DATA_DIR,
  GLOBAL_CONFIG_FILEPATH,
  DEFAULT_GLOBAL_CONFIG,
} = require('./constants');

function getGlobalConfig() {
  if (!fs.existsSync(GLOBAL_CONFIG_FILEPATH)) {
    return null;
  }

  const contents = fs.readFileSync(GLOBAL_CONFIG_FILEPATH);
  let globalConfig;
  try {
    globalConfig = JSON.parse(contents);
  } catch (error) {
    // couldn't read the file
    // TODO MAYBE show warning
    return null;
  }

  return Object.assign({}, DEFAULT_GLOBAL_CONFIG, globalConfig);
}

module.exports = getGlobalConfig;
