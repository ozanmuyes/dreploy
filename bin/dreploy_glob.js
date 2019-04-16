#!/usr/bin/env node

'use strict';

// NOTE TR Glob işlemleri

const globby = require('globby');


// NOTE This comes from `getProjectInfo()`
const projectInfoFromFn = {
  lang: 'nodejs',
  root: 'D:/Code/tmp/dreploy-test-dirs/nodejs',
};

// NOTE This comes from `.dreployrc.json/local/files`
const filesFromProjectConfig = [
  'src\\*',
  'package-lock.json',
];


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
function normalizeLocalFiles(files, projectInfo) {
  return new Promise(async (resolve) => {
    const preprocessedList = files.map(f => f.split('\\').join('/'));

    const resolveds = await globby(preprocessedList, {
      absolute: true,
      cwd: projectInfo.root,
      // See https://www.npmjs.com/package/globby#options
    });

    //

    resolve(resolveds);
  });
}


(async () => {
  const normalizedFiles = await normalizeLocalFiles(filesFromProjectConfig, projectInfoFromFn);

  console.log(normalizedFiles.join('\n'));
})();


/** @type {import('../typings/dreploy').ProjectInfo} ProjectInfo */
