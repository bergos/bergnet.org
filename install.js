#!/usr/bin/env node

require('shelljs/global')

var program = require('commander')

function clean () {
  rm('-rf', 'themes')
}

function dist () {
  // bootstrap files
  mkdir('-p', 'themes/bergos/source/css')
  cp('-r', 'node_modules/bergos-bootstrap/dist/css/bootstrap.min.css', 'themes/bergos/source/css')

  mkdir('-p', 'themes/bergos/source/fonts')
  cp('-r', 'node_modules/bergos-bootstrap/dist/fonts/*', 'themes/bergos/source/fonts')

  mkdir('-p', 'themes/bergos/source/images')
  cp('-r', 'node_modules/bergos-bootstrap/dist/images/*', 'themes/bergos/source/images')

  mkdir('-p', 'themes/bergos/source/js')
  cp('-r', 'node_modules/bergos-bootstrap/dist/js/bootstrap.min.js', 'themes/bergos/source/js')

  // jquery files
  cp('node_modules/jquery/dist/jquery.min.js', 'themes/bergos/source/js')
}

program
  .command('clean')
  .action(clean)

program
  .command('dist')
  .action(dist)

program.parse(process.argv)
