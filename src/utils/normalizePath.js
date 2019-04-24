'use strict';

/** @param {string} p */
function normalizePath(p, trailingSlash = true) {
  const n = p.split('\\').join('/');


  if (n.endsWith('/')) {
    if (trailingSlash === false) {
      // TODO remove trailing slash
      return n.substring(0, n.length - 2);
    }

    // else - nothing to do
    return n;
  }
  // else
  if (trailingSlash === true) {
    return `${n}/`;
  }
  // else - nothing to do
  return n;
}

module.exports = normalizePath;
