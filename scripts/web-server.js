#!/usr/bin/env node

var util    = require('util'),
    http    = require('http'),
    fs      = require('fs'),
    url     = require('url'),
    events  = require('events'),
    express = require('express');

var DEBUG        = false;
var DEBUG_LOGO   = '=============SHANHE=[Debug]==============';
var DEFAULT_PORT = 8000;
var DEFAULT_DIR  = '/srv/shanhe/app/'; // Production
DEFAULT_DIR = './app/'; // Dev


/**** Parse params from command-line. ****/
var args = process.argv;
args.splice(0, 2); // remove the first two args: node & JS-file
if (args.indexOf('debug') > -1) {
  args.splice(args.indexOf('debug'), 1);
  DEBUG = true;
  DEFAULT_DIR = './app/'; // Dev
  util.puts(DEBUG_LOGO);
}
if (args.length > 0 && args[0].match(/^\d{2,4}$/)) {
  DEFAULT_PORT = Number(args[0]);
}
/**** END ****/

var myServer = express();

/*
 *  Parseable urls : '/', '/home', '/blogs', '/profile'
 */
myServer.get('/:mainPage(home|blogs|profile)?', function(req, res) {
  if (DEBUG) util.log('[DEBUG] mainPage = ' + req.params.mainPage);
  var path = DEFAULT_DIR + 'index.html';
  if (DEBUG) util.log('[DEBUG] path = ' + path);
  requestHandler(req, res, path);
});

/*
 *  Parse all other (valid) urls from Angular.JS.
 *  It should not contain bad urls.
 */
myServer.get('/:mainPage(home|blogs|profile)?/*', function(req, res) {
  if (DEBUG) util.log('[DEBUG] req.params = ' + util.inspect(req.params));
  var path = DEFAULT_DIR + req.params[0];
  requestHandler(req, res, path);
});

myServer.listen(DEFAULT_PORT);
util.log("myServer starts listening to the PORT: " + DEFAULT_PORT);



/*
 *  Different methods and objects used for this router below.
 */

function requestHandler(req, res, path) {
  fs.stat(path, function(err, stat) {
    if (err) {
      if (DEBUG) util.log('[DEBUG][ERROR]: ' + util.inspect(err));
      return res.status(404).sendfile(DEFAULT_DIR + '404.html');
    }
    if (stat.isDirectory()) {
      // No desire for directory yet, so just return 404.
      return res.status(404).sendfile(DEFAULT_DIR + '404.html');
    }
    return res.status(200).sendfile(path);
  });
}



function escapeHtml(value) {
  return value.toString().
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('"', '&quot;');
}

/**
 * Handles static content.
 */

function StaticServlet() {}

StaticServlet.MimeMap = {
  'txt' : 'text/plain',
  'html': 'text/html',
  'css' : 'text/css',
  'xml' : 'application/xml',
  'json': 'application/json',
  'js'  : 'application/javascript',
  'jpg' : 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif' : 'image/gif',
  'png' : 'image/png',
  'svg' : 'image/svg+xml'
};