var Readable = require('stream').Readable;
var util = require('util');

function OrderedStreams(streams, options) {
  if (!(this instanceof(OrderedStreams))) {
    return new OrderedStreams(streams, options);
  }

  streams = streams || [];
  options = options || {};

  if (!Array.isArray(streams)) {
    streams = [streams];
  }

  options.objectMode = true;

  Readable.call(this, options);

  // stream data buffer
  this._buffs = [];

  if (streams.length === 0) {
    this.push(null); // no streams, close
    return;
  }  

  streams.forEach(function (s, i) {
    if (!s.readable) {
      throw new Error('All input streams must be readable');
    }
    s.on('error', function (e) {
      this.emit('error', e);
    }.bind(this));

    var buff = [];
    this._buffs.push(buff);

    s.on('data', buff.unshift.bind(buff));
    s.on('end', flushStreamAtIndex.bind(this, i));
  }, this);
}

util.inherits(OrderedStreams, Readable);

function flushStreamAtIndex (index) {
  this._buffs[index].finished = true;
  this._flush();
}

OrderedStreams.prototype._read = function () {};

OrderedStreams.prototype._flush = function () {
  for (var i = 0, buffs = this._buffs, l = buffs.length; i < l; i++) {
    if (buffs[i].finished !== true) {
      return;
    }
    // every buffs before index are all finished, ready to flush
    for (var j = 0; j <= i; j++) {
      var buffAtIndex = buffs[j];
      while (buffAtIndex.length) {
        this.push(buffAtIndex.pop());
      }
    }
  }
  // no more opened streams
  // flush buffered data (if any) before end
  this.push(null);
};

module.exports = OrderedStreams;
