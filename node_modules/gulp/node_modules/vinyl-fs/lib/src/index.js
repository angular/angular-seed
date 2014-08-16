'use strict';

var _ = require('lodash');
var defaults = _.defaults;

var through = require('through2');
var gs = require('glob-stream');
var File = require('vinyl');

var getContents = require('./getContents');
var getStats = require('./getStats');

function createFile (globFile, enc, cb) {
  cb(null, new File(globFile));
}

function src(glob, opt) {
  if (!isValidGlob(glob)) {
    throw new Error('Invalid glob argument: ' + glob);
  }

  var options = defaults({}, opt, {
    read: true,
    buffer: true
  });

  var globStream = gs.create(glob, options);

  // when people write to use just pass it through
  var outputStream = globStream
    .pipe(through.obj(createFile))
    .pipe(getStats(options));

  if (options.read !== false) {
    outputStream = outputStream
      .pipe(getContents(options));
  }

  return outputStream
    .pipe(through.obj());
}

function isValidGlob(glob) {
  if (typeof glob === 'string') {
    return true;
  }
  if (Array.isArray(glob) && glob.length !== 0) {
    return true;
  }
  return false;
}

module.exports = src;
