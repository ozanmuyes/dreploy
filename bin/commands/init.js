'use strict';

const fs = require('fs');
const path = require('path');

const {
  CONFIG_FILENAME,
  DEFAULT_GLOBAL_CONFIG,
  DEFAULT_TARGET_FILE,
} = require('../../src/constants');
const getGlobalConfig = require('../../src/getGlobalConfig');
const getProjectInfo = require('../../src/getProjectInfo');
const { Logger } = require('../../src/Logger');

let config;
let logger;

function handler(argv) {
  // #region Config and Logger

  // Get global config
  //
  let globalConfig = getGlobalConfig();
  if (globalConfig === null) {
    // TODO What to do? - MAYBE create the global config file
    globalConfig = DEFAULT_GLOBAL_CONFIG;
  }

  // Get config from CLI arguments
  //
  const configFromCli = {
    //
  };
  if (argv.verbose > 0) {
    // NOTE 'verbose' from `argv` is only to increment the log level read from global/project.
    //      To decrement the existing log level change the setting on the project config file.
    configFromCli.logLevel = (globalConfig.logLevel + argv.verbose);
  }
  //

  // Finally merge them together
  config = Object.assign({}, globalConfig, configFromCli);

  // Instantiate the logger
  logger = new Logger(config.logLevel);

  // #endregion Config and Logger

  // Try to get project info
  //
  const projectInfo = getProjectInfo(process.cwd(), config.maxUpLevelToProjectRoot);

  if (projectInfo === null) {
    logger.error('Not in a project root.');
    process.exitCode = 1;
    return;
  }

  logger.debug(`ProjectInfo: ${JSON.stringify(projectInfo)}`);


  const DEPLOY_TARGET_FILEPATH = path.join(projectInfo.root, CONFIG_FILENAME);

  // Check if deploy config file exists
  //
  if (fs.existsSync(DEPLOY_TARGET_FILEPATH)) {
    if (argv.force) {
      logger.warn('Be warned; overwriting existing deploy target file.');
    } else {
      logger.error("Deploy target file already exists for this project. Use '--force' flag to overwrite it. Existing file left intact.");
      process.exitCode = 1;
      return;
    }
  }

  // Create the file
  //
  if (argv.yes) {
    fs.writeFileSync(DEPLOY_TARGET_FILEPATH, `${JSON.stringify(DEFAULT_TARGET_FILE, null, 2)}\n`);

    logger.info('Deploy target file created.');
    process.exitCode = 0;
    return;
  }

  // TODO LATER Ask interactive questions and create deploy target file
  logger.warn("Interactive questionnaire wasn't implemented yet, use '--yes' flag for now. No changes has been made.");
}

module.exports = {
  command: 'init',
  describe: 'Initialize the deploy target for the project. Must be in a recognizable project root when running this command.',
  builder: {
    force: {
      alias: 'f',
      describe: 'Overwrite the existing deployment configuration file (if any).',
    },
    yes: {
      alias: 'y',
      describe: 'Create the deployment configuration file using default without asking questions interactively.',
    },
    // TODO dreploy --algorithm (TR kullanıcı isterse hash algoritmasını burada seçebilir, desteklenen algo'ların listesini dokümantasyonda yaz YA DA daha iyisi bunu `dreploy list-hash-algorithms` ile listele)
  },
  handler,
};
