'use strict';

const fs = require('fs');
const path = require('path');

const { CONFIG_FILENAME } = require('./constants');
const { Logger, LOG_LEVEL_FATAL } = require('./Logger');

/** @param {import('../../typings/dreploy').ProjectInfo} projectInfo */
function getProjectConfig(projectInfo) {
  const projectConfigFilepath = path.join(projectInfo.root, CONFIG_FILENAME);

  if (!fs.existsSync(projectConfigFilepath)) {
    return null;
  }

  const contents = fs.readFileSync(projectConfigFilepath);
  let projectConfig;
  try {
    projectConfig = JSON.parse(contents);
  } catch (error) {
    // couldn't read the file
    const logger = new Logger(LOG_LEVEL_FATAL);
    if (error instanceof SyntaxError) {
      logger.fatal(`Syntax error in deploy target file: '${error.message}'. Terminating...`);
    } else {
      logger.fatal('Unknown error occured while parsing the deploy target file. Terminating...');
    }
    return { error };
  }

  return projectConfig;
}

module.exports = getProjectConfig;
