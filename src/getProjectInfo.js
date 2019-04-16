'use strict';

const path = require('path');

const getProjectLang = require('./getProjectLang');
const normalizePath = require('./utils/normalizePath');

// TODO Only use forward-slash ('/') on paths (even on Windows)

/**
 * Try to determine project root starting from `startFrom` argument,
 * if the current working directory isn't the project root go
 * one level up until `maxUpLevelToProjectRoot` has been reached
 * or arrived to top-level in the filesystem (e.g.; '/'
 * in *nix, 'C:/' in Windows).
 *
 * If `maxUpLevelToProjectRoot` was set to 0 this means seek the project
 * only on the directory that the command was run in, do not go any up
 * level.
 *
 * @param {number} maxUpLevelToProjectRoot Maximum allowed number to go up-level in the filesystem
 * @returns {import('../typings/dreploy').ProjectInfo} The project info object (if found any) or `null`.
 */
function getProjectInfo(startFrom, maxUpLevelToProjectRoot = Number.MAX_SAFE_INTEGER) {
  const normalizedMaxUpLevel = (maxUpLevelToProjectRoot < 0)
    ? 0
    : maxUpLevelToProjectRoot;

  /** @type {string} */
  let projectLang;
  let upLevel = 0; // means the level is cwd
  let oldcwd = '';
  let cwd = startFrom;

  do {
    projectLang = getProjectLang(cwd);

    if (projectLang) { // projectLang !== null
      break;
    }

    // project language couldn't found

    oldcwd = cwd;
    cwd = path.join(cwd, '../'); // go one level up in the filesystem
    upLevel += 1;

    if (cwd === oldcwd) {
      // there is no up-level in the filesystem
      // (i.e. we are already on the top-level,
      // e.g.; '/' on *nix, 'C:\' on Windows)
      break;
    }
  } while (upLevel <= normalizedMaxUpLevel);

  if (projectLang === null) {
    return null;
  }

  return {
    root: normalizePath(cwd),
    lang: projectLang,
  };
}

module.exports = getProjectInfo;
