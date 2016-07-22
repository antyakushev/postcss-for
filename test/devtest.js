'use strict';

var fs = require('fs');
var postcss = require('postcss');
var postcssFor = require('..');

function fixturePath(name) {
  return 'test/' + name + '.css';
}

function fixture(name) {
  return fs.readFileSync(fixturePath(name), 'utf8').trim();
}

function compareFixtures(name) {
  var actualCss = postcss(postcssFor)
    .process(fixture(name), { from: fixturePath(name) })
    .css
    .trim();

  fs.writeFile(fixturePath(name + '.actual'), actualCss);

  return;
}

compareFixtures('devtest');