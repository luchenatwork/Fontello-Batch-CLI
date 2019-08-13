#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var SvgPath = require('svgpath');
var svg_image_flatten = require('./svgflatten');
var ArgumentParser = require('argparse').ArgumentParser;
var fontello = require('./fontello');

var parser = new ArgumentParser({
  version: require('./package.json').version,
  addHelp: true,
  description: 'Fontello Batch CLI'
});
parser.addArgument(['-p', '--path'], {
  help: 'Source SVG Font Path, e.g., "C:\\Svg Source", C:\\SvgSource',
  required: true
});
var args = parser.parseArgs();

var allocatedRefCode = 0xe800;
const svgFilesPath = args.path;
var svgFiles = filterSvgFiles(svgFilesPath);
var glyphs = [];

svgFiles.forEach(function(svgFile) {
  var path = require('path');
  var glyphName = path.basename(svgFile, '.svg').replace(/\s/g, '-');
  var data = fs.readFileSync(svgFile, 'utf-8');

  var result = svg_image_flatten(data);

  if (result.error) {
    console.error(result.error);
    return;
  }

  var scale = 1000 / result.height;
  var path = new SvgPath(result.d)
    .translate(-result.x, -result.y)
    .scale(scale)
    .abs()
    .round(1)
    .toString();

  if (path === '') {
    console.error(svgFile + ' has no path data!');
    return;
  }

  glyphs.push({
    uid: uid(),
    css: glyphName,
    code: allocatedRefCode++,
    src: 'custom_icons',
    selected: true,
    svg: {
      path: path,
      width: 1000
    },
    search: [glyphName]
  });
});

var output = {
  name: '',
  css_prefix_text: 'icon-',
  css_use_suffix: false,
  hinting: true,
  units_per_em: 1000,
  ascent: 850,
  glyphs: glyphs
};

fs.writeFileSync(
  path.join(svgFilesPath, 'config.json'),
  JSON.stringify(output),
  {
    encoding: 'utf-8',
    flag: 'w'
  }
);

fontello.install({
  config: path.join(svgFilesPath, 'config.json'),
  css: null,
  font: null,
  host: null,
  proxy: null
});

function uid() {
  /*eslint-disable no-bitwise*/
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
    return ((Math.random() * 16) | 0).toString(16);
  });
}

function filterSvgFiles(svgFolderPath) {
  let files = fs.readdirSync(svgFolderPath, 'utf-8');
  let svgArr = [];
  if (!files) {
    throw new Error(`Error! Svg folder is empty.${svgFolderPath}`);
  }

  for (let i in files) {
    if (typeof files[i] !== 'string' || path.extname(files[i]) !== '.svg')
      continue;
    if (!~svgArr.indexOf(files[i]))
      svgArr.push(path.join(svgFolderPath, files[i]));
  }
  return svgArr;
}
