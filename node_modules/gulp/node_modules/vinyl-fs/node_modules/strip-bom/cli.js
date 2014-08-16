#!/usr/bin/env node
'use strict';
var fs = require('fs');
var pkg = require('./package.json');
var stripBom = require('./index');
var input = process.argv[2];

function help() {
	console.log(pkg.description);
	console.log('');
	console.log('Usage');
	console.log('  $ strip-bom <file> > <new-file>');
	console.log('  $ cat <file> | strip-bom > <new-file>');
	console.log('');
	console.log('Example');
	console.log('  $ strip-bom unicorn.txt > unicorn-without-bom.txt');
}

if (process.argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (process.argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

if (process.stdin.isTTY) {
	if (!input) {
		help();
		return;
	}

	fs.createReadStream(input).pipe(stripBom.stream()).pipe(process.stdout);
} else {
	process.stdin.pipe(stripBom.stream()).pipe(process.stdout);
}
