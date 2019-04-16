'use strict';

function handler(argv) {
  // TODO
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
