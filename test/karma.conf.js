module.exports = function (config) {
    var conf = require('./karma.common.js');
    conf.basePath = '../';
    config.set(conf);
};
