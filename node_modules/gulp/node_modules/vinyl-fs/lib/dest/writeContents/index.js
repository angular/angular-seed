'use strict';

var writeDir = require('./writeDir');
var writeStream = require('./writeStream');
var writeBuffer = require('./writeBuffer');

function writeContents(writePath, file, cb) {
  var done = function(err){
    cb(err, file);
  };

  // if directory then mkdirp it
  if (file.isDirectory()) {
    writeDir(writePath, file, done);
    return;
  }

  // stream it to disk yo
  if (file.isStream()) {
    writeStream(writePath, file, done);
    return;
  }

  // write it like normal
  if (file.isBuffer()) {
    writeBuffer(writePath, file, done);
    return;
  }

  // if no contents then do nothing
  if (file.isNull()) {
    done();
    return;
  }
}

module.exports = writeContents;
