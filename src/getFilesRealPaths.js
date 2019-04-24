'use strict';

const globby = require('globby');

const normalizePath = require('./utils/normalizePath');

/**
 * Normalize the list of local files to be easily consumed by another internal function.
 * Normalization consist of; normalizing the directory separator on path strings,
 * converting relative paths into absolute paths (using project root),
 * resolving globs into real filepaths.
 *
 * @param {Array<string>} files List of local files to be deployed to the remote.
 * @param {ProjectInfo} projectInfo Project information object.
 * @returns {Array<string>} Normalized filepaths.
 */
function getFilesRealPaths(files, projectInfo) {
  return new Promise(async (resolve) => {
    // TODO Check if `files` is an array of strings

    const preprocessedList = files.map(f => normalizePath(f, false));

    const resolveds = await globby(preprocessedList, {
      absolute: true,
      cwd: projectInfo.root,
      // See https://www.npmjs.com/package/globby#options
    });

    //

    resolve(resolveds);
  });
}

module.exports = getFilesRealPaths;
