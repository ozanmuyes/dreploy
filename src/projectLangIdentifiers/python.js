'use strict';

// requirements.txt

module.exports = (/** @type {Array<import('fs').Dirent>} */ topLevelDirents) => {
  // Find the `requirements.txt` index in the `topLevelDirents`
  const index = topLevelDirents.findIndex(d => (d.isFile() && d.name === 'requirements.txt'));

  // Return `true` is `requirements.txt` exists, `false` otherwise
  return (index !== -1);
};
