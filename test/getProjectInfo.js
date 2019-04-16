'use strict';

/* eslint-disable no-console, no-lonely-if */

const path = require('path');

const getProjectInfo = require('../src/getProjectInfo');
const normalizePath = require('../src/utils/normalizePath');

const DREPLOY_PROJECT_ROOT = normalizePath(path.join(__dirname, '../'));
const EXPECTED = { root: DREPLOY_PROJECT_ROOT, lang: 'nodejs' };

const testCases = [
  { // 1
    startFrom: `${DREPLOY_PROJECT_ROOT}/bin`,
    maxUpLevelToProjectRoot: 0,

    expected: null,
  },
  { // 2
    startFrom: `${DREPLOY_PROJECT_ROOT}/bin`,
    maxUpLevelToProjectRoot: 1,

    expected: EXPECTED,
  },
  { // 3
    startFrom: `${DREPLOY_PROJECT_ROOT}/bin`,
    maxUpLevelToProjectRoot: 2,

    expected: EXPECTED,
  },
  { // 4
    startFrom: `${DREPLOY_PROJECT_ROOT}/bin`,
    maxUpLevelToProjectRoot: undefined,

    expected: EXPECTED,
  },
  { // 5
    startFrom: `${DREPLOY_PROJECT_ROOT}`,
    maxUpLevelToProjectRoot: 0,

    expected: EXPECTED,
  },
  { // 6
    startFrom: `${DREPLOY_PROJECT_ROOT}`,
    maxUpLevelToProjectRoot: 1,

    expected: EXPECTED,
  },
  { // 7
    startFrom: normalizePath(path.join(DREPLOY_PROJECT_ROOT, '../')),
    maxUpLevelToProjectRoot: 0,

    expected: null,
  },
  { // 8
    startFrom: normalizePath(path.join(DREPLOY_PROJECT_ROOT, '../')),
    maxUpLevelToProjectRoot: undefined,

    expected: null,
  },
  //
];

let i = 0; // test case index
let r; // result
testCases.forEach((c) => {
  i += 1;

  console.log(`Test case ${i}, expecting '${JSON.stringify(c.expected)}'...`);

  r = getProjectInfo(c.startFrom, c.maxUpLevelToProjectRoot);

  if (r === null && c.expected === null) {
    console.log('Succeeded.');
  } else if (r === null && c.expected !== null) {
    console.log('Failed (got null).');
  } else if (r !== null && c.expected === null) {
    // NOTE This is not mostly possible
    console.log(`Failed (got '${JSON.stringify(r)}').`);
  } else { // (r !== null && c.expected !== null)
    if (shallowCompare(r, c.expected)) {
      console.log('Succeeded.');
    } else {
      console.log(`Failed (expected object was different than the result object ${JSON.stringify(r)}).`);
    }
  }

  console.log(''); // new-line
});


/* eslint-disable */
// From https://stackoverflow.com/a/52323412/250453
function shallowCompare(obj1, obj2) {
  return (
    Object.keys(obj1).length === Object.keys(obj2).length
    && Object.keys(obj1).every(key =>
      Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key])
  );
}
/* eslint-enable */
