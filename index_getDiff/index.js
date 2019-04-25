'use strict';

const assert = require('assert');

const files = require('./files.json');
const oldFiles = require('./deployment.json').files;

const getDiff = require('../src/getDiff');


const diff = getDiff(files, oldFiles);

assert(diff.added);
assert(diff.added.length === 1);

assert(diff.changed);
assert(diff.changed.length === 1);

assert(diff.deleted);
assert(diff.deleted.length === 1);

assert(diff.same);
assert(diff.same.length === 2);

console.log('OK');
