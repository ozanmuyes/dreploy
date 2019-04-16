'use strict';

const fs = require('fs');

const projectLangIdentifiers = require('./projectLangIdentifiers');

/**
 * Determines if the given directory is a project root or not.
 *
 * If yes then returns the language that the project has been
 * written in, e.g.; returns 'javascript' for a JavaScript
 * project, 'ruby' for Ruby project.
 *
 * If no then returns `null`.
 *
 * @param {string} dir Directory path to seek for language.
 * @returns {string} The project language (if found any) as string or `null`.
 */
function getProjectLang(dir) {
  const topLevelDirents = fs.readdirSync(dir, { withFileTypes: true });

  if (topLevelDirents.length === 0) {
    // directory is empty
    return null;
  }

  let foundProjectLang = '';
  for (let i = 0; i < projectLangIdentifiers.length; i += 1) {
    if (projectLangIdentifiers[i].fn(topLevelDirents) === true) {
      foundProjectLang = projectLangIdentifiers[i].name;
      break;
    }
  }

  return (foundProjectLang || null);
}

module.exports = getProjectLang;
