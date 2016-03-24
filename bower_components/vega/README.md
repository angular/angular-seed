Vega: A Visualization Grammar
====
[![Build Status](https://travis-ci.org/vega/vega.svg)](https://travis-ci.org/vega/vega) 

**Vega** is a _visualization grammar_, a declarative format for creating and
saving interactive visualization designs. With Vega you can describe data 
visualizations in a JSON format, and generate interactive views using either 
HTML5 Canvas or SVG.

To learn more, [visit the wiki](https://github.com/vega/vega/wiki).

## The Vega Runtime

This repository contains the **vega-runtime** system, which parses Vega
specifications to produce interactive visualizations which run in the
browser using a scenegraph-based rendering system.

## Build Process

To manually build Vega, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the vega folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files into vega.js, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified vega.min.js.

Vega visualization specifications can be validated against a [JSON Schema](http://json-schema.org/). To generate the vega-schema.json definition file, run `npm run schema`.

Built files are available on [npm](https://www.npmjs.com/package/vega), and under [tagged releases](https://github.com/vega/vega/releases). The latest built versions can be found at [vega.min.js](http://vega.github.io/vega/vega.min.js) and [vega-schema.json](http://vega.github.io/vega/vega-schema.json).

## Vega Server-Side and Command Line Tools

Vega can also be run server-side using node.js. When running in "headless"
mode, Vega can be used to render specifications directly to PNG or SVG. In
addition to the summary below, [see the Headless Mode wiki
documentation](https://github.com/vega/vega/wiki/Headless-Mode) for more
information.

### Command Line Tools

Vega includes two command line tools for converting Vega JSON specifications
to rendered PNG or SVG:

* __vg2png__: `vg2png [-b basedir] vega_json_file [output_png_file]`
* __vg2svg__: `vg2svg [-b basedir] [-h] vega_json_file [output_svg_file]`

Within the Vega project directories, you can invoke these utilities using
`./bin/vg2png` or `./bin/vg2svg`. If you import Vega using npm, these commands
are accessible either locally (`node_modules/.bin/vg2png`) or globally
(`vg2png`) depending on how you install the Vega package.

### Using Vega in node.js Projects

To include Vega in a node project, first install it from the command line
using npm (`npm install vega`) or by including `"vega"` among the dependencies
in your package.json file.
