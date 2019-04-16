'use strict';

const fs = require('fs');

/** @type {import('crypto')} */
let crypto;
try {
  // eslint-disable-next-line global-require
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
  process.exit(1);
}

const bluebird = require('bluebird');


async function calculateFileHash(filepath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1');
    const input = fs.createReadStream(filepath);

    hash.on('error', (error) => {
      input.unpipe(hash);
      input.close();

      reject(error);
    });

    hash.on('readable', () => {
      const data = hash.read();

      if (data) {
        input.unpipe(hash);
        input.close();
        hash.end();

        resolve(data.toString('hex'));
      }
    });

    input.pipe(hash);
  });
}


const files = [
  'D:/Resimler/Ekran Alıntısı.PNG',
  'D:/Resimler/Ekran Alıntısı2.PNG',
  'D:/Resimler/left-off.PNG',
  'D:/Resimler/ok_ders-progg.PNG',
  'D:/Resimler/pasabet1.PNG',
  'D:/Resimler/pasabet2.PNG',
  //
];

bluebird.map(files, f => calculateFileHash(f), { concurrency: 3 }).then((hashes) => {
  for (let i = 0; i < files.length/* or `hashes.length` */; i += 1) {
    // eslint-disable-next-line no-console
    console.log(`${files[i]}\t\t${hashes[i]}`);
  }
});

// TODO pre- and postDeploy hooks for local and remote;
//      local hook scripts MUST be on the local machine
//      remote hool scripts MUST be on both of the machines (i.e. if pre-/postDeploy hook script is not on project config's files array it won't be executed)
//      ALSO those hook scripts must have preceding '#!/usr/bin/env node' shebang (or for python, ruby etc.)
//      other than JS/Python/Ruby scripts Bash scripts (w/ 'sh' extension) might as well be used
