'use strict';

/** @param {string} p */
function normalizePath(p) {
  const n = p.split('\\').join('/');

  return (n.endsWith('/'))
    ? n
    : `${n}/`;
}

module.exports = normalizePath;
