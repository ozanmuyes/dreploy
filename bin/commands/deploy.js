'use strict';

const fs = require('fs');
const path = require('path');

const {
  DEFAULT_GLOBAL_CONFIG,
  DEPLOYMENT_FILENAME,
} = require('../../src/constants');
const getGlobalConfig = require('../../src/getGlobalConfig');
const getProjectConfig = require('../../src/getProjectConfig');
const getProjectInfo = require('../../src/getProjectInfo');
const { Logger } = require('../../src/Logger');

let config;
let logger;

function handler(argv) {
  // #region Project Info, Config and Logger

  // Get global config
  //
  let globalConfig = getGlobalConfig();
  if (globalConfig === null) {
    // TODO What to do? - MAYBE create the global config file
    globalConfig = DEFAULT_GLOBAL_CONFIG;
  }

  logger = new Logger(globalConfig.logLevel);

  // Try to get project info
  //
  const projectInfo = getProjectInfo(process.cwd(), globalConfig.maxUpLevelToProjectRoot);

  if (projectInfo === null) {
    logger.error('Not in a project root.');
    process.exitCode = 1;
    return;
  }

  // Get project config
  //
  const projectConfig = getProjectConfig(projectInfo);

  if (projectConfig === null) {
    logger.error("Dreploy wasn't initialized for this project. Initialize Dreploy for this project via 'dreploy init' in this directory.");
    process.exitCode = 1;
    return;
  }

  // Get config from CLI arguments
  //
  const configFromCli = {
    //
  };
  if (argv.verbose > 0) {
    // NOTE 'verbose' from `argv` is only to increment the log level read from global/project.
    //      To decrement the existing log level change the setting on the project config file.
    configFromCli.logLevel = (projectConfig.logLevel + argv.verbose);
  }
  //

  // Finally merge them together
  config = Object.assign({}, globalConfig, projectConfig, configFromCli);

  // Re-assign the `logger` to also use project config
  logger = new Logger(config.logLevel);

  // #endregion Project Info, Config and Logger

  // TODO Check if connection can be established (i.e. credentials are valid)

  // Check if 'deployment.json' exists
  if (fs.existsSync(path.join(projectInfo.root, DEPLOYMENT_FILENAME))) {
    // TODO re-deploying
  } else {
    // TODO deploying for the first-time
  }
}

module.exports = {
  command: ['deploy', '$0'],
  describe: 'Copy selected source files to the remote.',
  builder: {
    force: {
      alias: 'f',
      describe: 'Forcefully copy the local file to remote and overwrite contents on hash mismatch. User will be involved in the process by entering the filename to confirm the overwrite.',
    },
    'dry-run': {
      alias: 'x',
      describe: 'Do not deploy files, just print what actions is going to be taken.',
    },
  },
  handler,
};
