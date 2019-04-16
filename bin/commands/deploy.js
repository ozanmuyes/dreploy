'use strict';

function handler(argv) {
  // TODO
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
