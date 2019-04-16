'use strict';

// TODO Import all the sibling "files" (no 'foo/index.js' as of now)
//      and export them as array

const fs = require('fs');

const identifiers = [];

fs.readdirSync(__dirname)
  .filter(f => !(f === 'index.js' && f.substr(-3) === '.js'))
  .map(f => `./${f}`)
  .forEach((f) => {
    identifiers.push({
      name: f.substr(2, f.length - (2 + 3 /* for extension */)),
      fn: require(f),
    });
  });

module.exports = identifiers;
