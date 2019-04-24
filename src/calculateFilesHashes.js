'use strict';

const fs = require('fs');

/** @type {import('crypto')} */
let crypto;
try {
  // eslint-disable-next-line global-require
  crypto = require('crypto');
} catch (err) {
  // FIXME
  console.log('crypto support is disabled!');
  process.exit(1);
}

const bluebird = require('bluebird');

/** @param {Array<string>} filepaths Array of absolute filepath(s) */
async function calculateFilesHashes(filepaths) {
  return bluebird.map(filepaths, f => calculateFileHash(f), { concurrency: 3 })/* .then((hashes) => {
    for (let i = 0; i < filepaths.length; i += 1) {
      // eslint-disable-next-line no-console
      console.log(`${filepaths[i]}\t\t${hashes[i]}`);
    }
  }) */;
}

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

module.exports = calculateFilesHashes;
