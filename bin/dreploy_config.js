#!/usr/bin/env node

'use strict';

// #region Get project info

const chalk = require('chalk');


const getProjectInfo = require('../src/getProjectInfo');

const projectInfo = getProjectInfo(process.cwd());

if (projectInfo === null) {
  // NOTE Here we are directly using chalk due to there is no Logger instance yet
  console.error(chalk.red('Not in a project root.'));
  process.exit(1);
}

// #endregion Get project info


const { Logger, LOG_LEVEL_FATAL } = require('../src/Logger');

const getGlobalConfig = require('../src/getConfig/getGlobalConfig');
const getProjectConfig = require('../src/getConfig/getProjectConfig');

// TODO TR project config'i yeri geldiği zaman oku, okuyamazsan orada hata ver
//      çünkü bazı command'lar (örn. 'init') project config'siz de çalışabilirler
//      (ki 'init' command'ının amacı project config'i oluşturmak)
const globalConfig = getGlobalConfig();
if (globalConfig === null) {
  // TODO What to do? - MAYBE create the global config file and assign globalConfig to DEFAULT_GLOBAL_CONFIG from constants
}
const projectConfig = getProjectConfig(projectInfo);
// NOTE Do nothing here if `projectConfig` is `null`, take action according to the CLI arguments.
// if (projectConfig === null) {
//   (new Logger(LOG_LEVEL_FATAL)).fatal("Deploy target must have been initialized before deploying. Run 'dreploy init' on the project root and then re-run this command. Terminating...");
//   process.exit(1);
// }

// eslint-disable-next-line import/order
const argv = require('yargs')
  .scriptName('dreploy')
  .command('init', 'Initialize the deploy target for the project. Must be in a recognizable project root when running this command.')
  .count('verbose')
  .alias('V', 'verbose')
  // TODO dreploy --dry-run (TR dosyaları aktarma, sadece yapılacak işlemleri göster; index.js güncellenecek, foo.js gönderilecek ancak remote'da değiştirilmiş, bar.js silinecek, qux.js oluşturulacak vb.)
  // TODO dreploy --hash-algorithm (TR kullanıcı isterse hash algoritmasını burada seçebilir, dokümantasyonda desteklenen algo'ların listesini yaz YA DA daha iyisi bunu `dreploy list-hash-algorithms` ile listele)
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .epilog('Visit https://github.com/dreploy#usage-examples to see usage examples.')
  .argv;


// Get config from global and project...
const combinedConfig = Object.freeze(Object.assign({}, globalConfig, projectConfig || {}));

// Get config from CLI arguments
//
const configFromCli = {
  //
};
if (argv.verbose > 0) {
  // NOTE 'verbose' from `argv` is only to increment the log level read from global/project.
  //      To decrement the existing log level change the setting on the project config file.
  configFromCli.logLevel = (combinedConfig.logLevel + argv.verbose);
}
//

// ...merge all of them together to get final config object
const config = Object.freeze(Object.assign({}, combinedConfig, configFromCli));


// NOTE Instantiate the logger after getting the config
const theLogger = new Logger(config.logLevel);
Object.defineProperty(global, 'logger', { value: theLogger });

// FIXME Remove below after manual tests
logger.fatal('fatal');
logger.error('error');
logger.warn('warn');
logger.info('info can be seen via -V');
logger.log('log can be seen via -V');
logger.debug('debug can be seen via -VV');
