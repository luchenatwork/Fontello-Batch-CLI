#!/usr/bin/env node

'use strict';

var fs = require('fs');
var SvgPath = require('svgpath');
var svg_image_flatten = require('./svgflatten');

var data = fs.readFileSync(
  'D:\\Download\\SvgTest\\Icon Checkbox Circle Checked 24px.svg',
  'utf-8'
);
// var data =
//   '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 55.2 (78181) - https://sketchapp.com --><title>Icons/24px/Icon Actions 24px</title><desc>Created with Sketch.</desc><g id="Icons/24px/Icon-Actions-24px" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M17,11.5 L17,12.5 L7,12.5 L7,11.5 L17,11.5 Z M12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 Z M12,20.9569161 C16.9467682,20.9569161 20.9569161,16.9467682 20.9569161,12 C20.9569161,7.05323183 16.9467682,3.0430839 12,3.0430839 C7.05323183,3.0430839 3.0430839,7.05323183 3.0430839,12 C3.0430839,16.9467682 7.05323183,20.9569161 12,20.9569161 Z" id="Icon-Actions" fill="#808082"></path></g></svg>';

var result = svg_image_flatten(data);

if (result.error) {
  console.error(result.error);
  return;
}

var scale = 1000 / result.height;
var output = new SvgPath(result.d)
  .translate(-result.x, -result.y)
  .scale(scale)
  .abs()
  .round(1)
  .toString();

console.log(output);
