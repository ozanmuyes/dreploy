'use strict';

/**
 * Get the difference between last deployed files and local files to be deployed.
 *
 * @param {Array<FileToBeDeployed>} newFiles Array of objects for local files to be deployed.
 * @param {Array<DeployedFile>} deploymentFiles Deployed files' records.
 * @returns {Diff}
 */
function getDiff(newFiles, deploymentFiles) {
  const deployeds = deploymentFiles.slice();

  const diff = {
    added: [],
    changed: [],
    deleted: [],
    same: [],
  };

  let tmpi;
  newFiles.forEach((f) => {
    tmpi = deployeds.findIndex(d => d.path === f.remotePath);

    if (tmpi >= 0) {
      // (file) record existing on both lists - so it can only go either changed or same
      if (f.localHash === deployeds[tmpi].hash) {
        diff.same.push(f);
      } else {
        diff.changed.push(f);
      }

      // NOTE TR deploy edilen dosyanın kaydını (yukarıdaki şekilde) işledikten (changed or same'e kaydettikten sonra)
      //      deploy edilen dosya kayıtları listesinden siliyoruz. bunun 2 nedeni var; birincisi zaten işlenen dosya
      //      kaydına (her iteration'da) tekrar tekrar bakmamıza gerek yok (hatta bakmamalıyız), ikincisi ise bu
      //      ve bunun gibi işlenen kayıtlar elendikten sonra deploy edilen dosya kayıtları listesinde (`deployeds`)
      //      kalan elemanlar deleted olarak kaydedilecek.
      deployeds.splice(tmpi, 1);
    } else {
      // (file) record is only existing on `files` list - so it's added
      diff.added.push(f);
    }
  });

  if (deployeds.length > 0) {
    // there are (file) record(s) on the deployed files list - so they are marked as deleted (actually TO BE DELETED)
    diff.deleted.push(...deployeds.slice().map(d => ({
      localPath: null,
      localHash: null,
      remotePath: d.hash,
    })));
  }

  return diff;
}

module.exports = getDiff;


/**
 * @typedef {object} FileToBeDeployed
 * @property {string} localPath
 * @property {string} localHash
 * @property {string} remotePath
 */

/**
 * @typedef {object} DeployedFile
 * @property {string} path
 * @property {string} hash
 */

/**
 * @typedef {object} Diff
 * @property {Array<FileToBeDeployed>} added
 * @property {Array<FileToBeDeployed>} changed
 * @property {Array<FileToBeDeployed>} deleted
 * @property {Array<FileToBeDeployed>} same
 */
