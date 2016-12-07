'use strict';

// Constants
const baseSrcDir = 'node_modules';
const baseDstDir = 'app/lib';
const files = [
  'html5-boilerplate/dist/css/main.css',
  'html5-boilerplate/dist/css/normalize.css',
  'html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
  'angular/angular.js',
  'angular/angular.min.js',
  'angular/angular.min.js.map',
  'angular-route/angular-route.js',
  'angular-route/angular-route.min.js',
  'angular-route/angular-route.min.js.map',
  'angular-loader/angular-loader.js',
  'angular-loader/angular-loader.min.js',
  'angular-loader/angular-loader.min.js.map'
];

// Imports
const path = require('path');
const shx = require('shelljs');

// Copy lib files
shx.rm('-rf', baseDstDir);

files.forEach(relPath => {
  const srcPath = path.join(baseSrcDir, relPath);
  const dstPath = path.join(baseDstDir, relPath);
  const dstDir = path.dirname(dstPath);

  shx.mkdir('-p', dstDir);
  shx.cp(srcPath, dstDir);
});
