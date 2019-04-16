'use strict';

// package.json

module.exports = (/** @type {Array<import('fs').Dirent>} */ topLevelDirents) => {
  // Find the `package.json` index in the `topLevelDirents`
  const index = topLevelDirents.findIndex(d => (d.isFile() && d.name === 'package.json'));

  // Return `true` is `package.json` exists, `false` otherwise
  return (index !== -1);
};
