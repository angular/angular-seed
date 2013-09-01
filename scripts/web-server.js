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
 *  Parse all other urls, including those from Angular.JS, and bad urls.
 */
myServer.get('/*', function(req, res) {
  if (DEBUG) util.log('req.params = ' + util.inspect(req.params));
  var path = DEFAULT_DIR + req.params[0];
  requestHandler(req, res, path);
});

myServer.listen(DEFAULT_PORT);
util.log("myServer starts listening to the PORT: " + DEFAULT_PORT);



/*
 *  Different methods and objects used for this router below.
 */

var requestHandler = function(req, res, path) {
  fs.stat(path, function(err, stat) {
    if (err) {
      if (DEBUG) util.log('[DEBUG][ERROR]: ' + util.inspect(err));
      return new StaticServlet().sendMissing_(req, res, path);
    }
    if (stat.isDirectory()) {
      // No desire for directory yet, so just return 404.
      return new StaticServlet().sendMissing_(req, res, path);
    }
    return new StaticServlet().sendFile_(req, res, path);
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

StaticServlet.prototype.sendError_ = function(req, res, error) {
  res.writeHead(500, {
      'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>Internal Server Error</title>\n');
  res.write('<h1>Internal Server Error</h1>');
  res.write('<pre>' + escapeHtml(util.inspect(error)) + '</pre>');
  util.puts('500 Internal Server Error');
  util.puts(util.inspect(error));
};

StaticServlet.prototype.sendMissing_ = function(req, res, path) {
  path = path.substring(1);
  res.writeHead(404, {
      'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>404 Not Found</title>\n');
  res.write('<h1>Not Found</h1>');
  res.write(
    '<p>The requested URL ' +
    escapeHtml(path) +
    ' was not found on this server.</p>'
  );
  res.end();
  util.puts('404 Not Found: ' + path);
};

StaticServlet.prototype.sendForbidden_ = function(req, res, path) {
  path = path.substring(1);
  res.writeHead(403, {
      'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>403 Forbidden</title>\n');
  res.write('<h1>Forbidden</h1>');
  res.write(
    '<p>You do not have permission to access ' +
    escapeHtml(path) + ' on this server.</p>'
  );
  res.end();
  util.puts('403 Forbidden: ' + path);
};

StaticServlet.prototype.sendRedirect_ = function(req, res, redirectUrl) {
  res.writeHead(301, {
      'Content-Type': 'text/html',
      'Location': redirectUrl
  });
  res.write('<!doctype html>\n');
  res.write('<title>301 Moved Permanently</title>\n');
  res.write('<h1>Moved Permanently</h1>');
  res.write(
    '<p>The document has moved <a href="' +
    redirectUrl +
    '">here</a>.</p>'
  );
  res.end();
  util.puts('301 Moved Permanently: ' + redirectUrl);
};

StaticServlet.prototype.sendFile_ = function(req, res, path) {
  var self = this;
  var file = fs.createReadStream(path);
  res.writeHead(200, {
    'Content-Type': StaticServlet.
      MimeMap[path.split('.').pop()] || 'text/plain'
  });
  if (req.method === 'HEAD') {
    res.end();
  } else {
    file.on('data', res.write.bind(res));
    file.on('close', function() {
      res.end();
    });
    file.on('error', function(error) {
      /* TODO: This is a problem, the header cannot be sent twice */
      //self.sendError_(req, res, error);
      util.log("File reading meets some internal problems. Not sure " +
          "the server is down or not. Please check!");
    });
  }
};
/*
StaticServlet.prototype.sendDirectory_ = function(req, res, path) {
  var self = this;
  if (path.match(/[^\/]$/)) {
    req.url.pathname += '/';
    var redirectUrl = url.format(url.parse(url.format(req.url)));
    return self.sendRedirect_(req, res, redirectUrl);
  }
  fs.readdir(path, function(err, files) {
    if (err)
      return self.sendError_(req, res, error);

    if (!files.length)
      return self.writeDirectoryIndex_(req, res, path, []);

    var remaining = files.length;
    files.forEach(function(fileName, index) {
      fs.stat(path + '/' + fileName, function(err, stat) {
        if (err)
          return self.sendError_(req, res, err);
        if (stat.isDirectory()) {
          files[index] = fileName + '/';
        }
        if (!(--remaining))
          return self.writeDirectoryIndex_(req, res, path, files);
      });
    });
  });
};

StaticServlet.prototype.writeDirectoryIndex_ = function(req, res, path, files) {
  path = path.substring(1);
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  res.write('<!doctype html>\n');
  res.write('<title>' + escapeHtml(path) + '</title>\n');
  res.write('<style>\n');
  res.write('  ol { list-style-type: none; font-size: 1.2em; }\n');
  res.write('</style>\n');
  res.write('<h1>Directory: ' + escapeHtml(path) + '</h1>');
  res.write('<ol>');
  files.forEach(function(fileName) {
    if (fileName.charAt(0) !== '.') {
      res.write('<li><a href="' +
        escapeHtml(fileName) + '">' +
        escapeHtml(fileName) + '</a></li>');
    }
  });
  res.write('</ol>');
  res.end();
};
*/