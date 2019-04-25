'use strict';

const fs = require('fs');
const path = require('path');

const bluebird = require('bluebird');
const Client = require('ssh2').Client;
const { until, eachSeries } = require('async');

const {
  CONFIG_FILENAME,
  DEFAULT_GLOBAL_CONFIG,
  DEPLOYMENT_FILENAME,
} = require('../../src/constants');
const calculateFilesHashes = require('../../src/calculateFilesHashes');
const getDiff = require('../../src/getDiff');
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
  const files = [];
  for (let i = 0; i < projectLocalFilesRealPaths.length; i += 1) {
    files.push({
      localPath: projectLocalFilesRealPaths[i],
      localHash: hashes[i],
      remotePath: getRemotePathFromLocalAbsPath(projectLocalFilesRealPaths[i], projectInfo, projectConfig),
      //
    });
  }

  // Get differences
  //
  // Check if 'deployment.json' exists
  const OLD_DEPLOYMENT_FILE = path.join(projectInfo.root, DEPLOYMENT_FILENAME);
  let deploymentFile;
  if (fs.existsSync(OLD_DEPLOYMENT_FILE)) {
    // re-deploying
    // eslint-disable-next-line global-require, import/no-dynamic-require
    deploymentFile = require(OLD_DEPLOYMENT_FILE);
  } else {
    // deploying for the first-time
    deploymentFile = [];
  }

  // Finally calculate diff
  const diff = getDiff(files, deploymentFile.files || []);

  if (Boolean(argv.dryRun) === true) {
    // TODO write preDeployLocalHook and preDeployRemoteHook


    let buffer;

    // Print added files list
    //
    if (diff.added.length > 0) {
      buffer = ['Files to be created on remote;'];
      diff.added.forEach(f => buffer.push(`  * ${f.remotePath}`));
      logger.info(buffer.join('\n'));
    }

    // TODO print changed files list
    // TODO print deleted files list


    // TODO write postDeployLocalHook and postDeployRemoteHook

    return;
  }

  // #region Sending to remote

  // Initialize connection
  //
  const conn = new Client();

  // TODO MAYBE those are not needed - see default target file on user_data dir (on 'constants.js')
  const defaultConnectConfig = {
    host: '127.0.0.1',
    port: 22,
    //
  };

  const connConfig = Object.assign({}, defaultConnectConfig,
    (projectConfig && projectConfig.remote) || {});

  conn.on('error', (err) => {
    //
    const error = err;
    debugger;
  });

  conn.on('ready', () => {
    // connected to remote

    conn.sftp((err, sftp) => {
      if (err) {
        //
        const error = err;
        debugger;
      }

      // SFTP session has started

      // TODO preDeployLocalHook, preDeployRemoteHook

      // TODO dosyaları göndermeye başlamadan önce DEPLOYMENT_FILE'dakilerle remote'dakiler eşleşiyor mu diye bak.

      processAddedFiles(diff.added, sftp)
        .then(() => processChangedFiles(diff.changed, sftp))
        // TODO .then(() => processDeletedFiles(diff.deleted, sftp))
        .then(() => {
          // file transfer has done
          // TODO write 'deployment.json'
          // TODO invoke postDeployLocalHook and postDeployRemoteHook
          // TODO close connections (sftp and ssh)
          //
          debugger;
        })
        .catch((processError) => {
          //
          const eee = processError;
          debugger;
        });
    });
  });

  conn.connect(connConfig);

  // #endregion Sending to remote


  // NOTE pre- and postDeploy hooks for local and remote;
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

/**
 * @param {Array<FileToBeDeployed>} addedFiles Added files
 * @param {import('ssh2').SFTPWrapper} sftp SFTP connection object.
 * @return {Promise}
 */
function processAddedFiles(addedFiles, sftp) {
  return bluebird.each(addedFiles, af /* added file */ => new Promise((resolve, reject) => {
    mkdir(path.dirname(af.remotePath), () => {
      sftp.fastPut(
        af.localPath,
        af.remotePath,
        {
          concurrency: 64, // default
          chunkSize: 32768, // default
          step: (transferred, chunk, total) => {
            // TODO throttle(this.emit('transfer', undefined, Math.min(Math.floor(totalTransferred / total * 100), 99), total);)
          },
          // mode
        },
        (sftpFastPutError) => {
          if (sftpFastPutError) {
            reject(sftpFastPutError);
          } else {
            resolve();
          }
        },
      );
    }, sftp);
  }));
}

/**
 * @param {Array<FileToBeDeployed>} changedFiles Changed files
 * @param {import('ssh2').SFTPWrapper} sftp SFTP connection object.
 * @return {Promise}
 */
function processChangedFiles(changedFiles, sftp) {
  // TODO Confirm overwrite

  return bluebird.each(changedFiles, cf /* changed file */ => new Promise((resolve, reject) => {
    sftp.fastPut(
      cf.localPath,
      cf.remotePath,
      {
        concurrency: 64, // default
        chunkSize: 32768, // default
        step: (transferred, chunk, total) => {
          // TODO throttle(this.emit('transfer', undefined, Math.min(Math.floor(totalTransferred / total * 100), 99), total);)
        },
        // mode
      },
      (sftpFastPutError) => {
        if (sftpFastPutError) {
          reject(sftpFastPutError);
        } else {
          resolve();
        }
      },
    );
  }));
}

// TODO processDeletedFiles

function mkdir(dir, cb, sftp, attrs = undefined) {
  let _dir = dir;
  let _attrs;
  if (attrs) {
    _attrs = attrs;
    _attrs.mode = getFolderAttr(process.platform, _attrs);
  }

  const dirs = [];
  let exists = false;

  // for record log
  // eslint-disable-next-line no-underscore-dangle
  const _mkdir = (__dir, mkdirCb) => {
    sftp.mkdir(__dir, _attrs, mkdirCb);
  };

  until(() => exists, (done) => {
    // detect if the directory exists
    sftp.stat(_dir, (sftpStatError) => {
      if (sftpStatError) {
        dirs.push(_dir);
        _dir = path.dirname(_dir);
      } else {
        exists = true;
      }
      done();
    });
  }, (untilError) => {
    if (untilError) {
      cb(untilError);
    } else {
      // just like mkdir -p
      eachSeries(dirs.reverse(), _mkdir, cb);
    }
  });
}

function getFolderAttr(platform, attrs) {
  const DEFAULT_MODE = '0755';

  if (platform === 'win32') {
    return DEFAULT_MODE;
  }

  if (attrs) {
    return attrs.mode || DEFAULT_MODE;
  }

  return null;
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
