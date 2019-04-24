'use strict';

const fs = require('fs');
const path = require('path');

const {
  CONFIG_FILENAME,
  DEFAULT_GLOBAL_CONFIG,
  DEPLOYMENT_FILENAME,
} = require('../../src/constants');
const calculateFilesHashes = require('../../src/calculateFilesHashes');
const getFilesRealPaths = require('../../src/getFilesRealPaths');
const getGlobalConfig = require('../../src/getGlobalConfig');
const getProjectConfig = require('../../src/getProjectConfig');
const getProjectInfo = require('../../src/getProjectInfo');
const { Logger } = require('../../src/Logger');
const normalizePath = require('../../src/utils/normalizePath');

let config;
let logger;

async function handler(argv) {
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

  if (projectConfig.error) {
    // The error has already been printed
    process.exitCode = 3;
    return;
  }

  if (typeof projectConfig.local !== 'object' || typeof projectConfig.local.files !== 'object' || !Array.isArray(projectConfig.local.files)) {
    logger.warn(`There are no files registered for this project to deploy. Please check that '${CONFIG_FILENAME}/local/files' is a non-empty array of filepaths. No changes has been made.`);
    process.exitCode = 2;
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
    configFromCli.logLevel = ((projectConfig.logLevel || globalConfig.logLevel) + argv.verbose);
  }
  //

  // Finally merge them together
  config = Object.assign({}, globalConfig, projectConfig, configFromCli);

  // Re-assign the `logger` to also use project config
  logger.logLevel = config.logLevel;

  // #endregion Project Info, Config and Logger

  if (Boolean(argv.dryRun) === false) {
    // TODO Check if connection can be established (i.e. credentials are valid)
  }


  // TODO TR burada mı bilemiyorum ama bi yerde 'projectConfig.remote.path' set edilmiş mi diye check et

  // Get real paths from .reploy.json/project/files entries (i.e. globs)
  //
  const projectLocalFilesRealPaths = await getFilesRealPaths(projectConfig.local.files, projectInfo);

  if (projectLocalFilesRealPaths.length === 0) {
    // TODO there are no files existing on the fs matching the globs on project config local files
  }

  // Calculate hashes of the project local files existing on the fs
  const hashes = await calculateFilesHashes(projectLocalFilesRealPaths);

  // Finish processing project local files
  //
  const files = {};
  for (let i = 0; i < projectLocalFilesRealPaths.length; i += 1) {
    files[projectLocalFilesRealPaths[i]] = {
      localPath: projectLocalFilesRealPaths[i],
      hash: hashes[i],
      remotePath: getRemotePathFromLocalAbsPath(projectLocalFilesRealPaths[i], projectInfo, projectConfig),
      //
    };
  }

  // Check if 'deployment.json' exists
  if (fs.existsSync(path.join(projectInfo.root, DEPLOYMENT_FILENAME))) {
    // TODO re-deploying
  } else {
    // TODO deploying for the first-time
    // all entries in the `files` are considered 'new' (as action, to create on the server)
  }
  // TODO TR bu kısımdan sonra added, changed, deleted key'lerini barındıran bir obje elde etmeliyiz. bu key'lerin value'lar array (of TODO BİŞİ) olmalı

  // TODO remote'a gönderme kodları - ANCAK dosyaları göndermeye başlamadan önce DEPLOYMENT_FILE'dakilerle remote'dakiler eşleşiyor mu diye bak.


  // TODO pre- and postDeploy hooks for local and remote;
  //      local hook scripts MUST be on the local machine
  //      remote hool scripts MUST be on both of the machines (i.e. if pre-/postDeploy hook script is not on project config's files array it won't be executed)
  //      ALSO those hook scripts must have preceding '#!/usr/bin/env node' shebang (or for python, ruby etc.)
  //      other than JS/Python/Ruby scripts Bash scripts (w/ 'sh' extension) might as well be used
}

/**
 *
 * @param {string} filepath fileRealLocalAbsolutePath.
 * @param {ProjectInfo} projectInfo Project info object.
 * @param {ProjectConfig} projectConfig Project config object.
 */
function getRemotePathFromLocalAbsPath(filepath, projectInfo, projectConfig) {
  return `${normalizePath(projectConfig.remote.path, true)}${normalizePath(path.relative(projectInfo.root, filepath), false)}`;
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
