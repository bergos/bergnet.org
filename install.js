#!/usr/bin/env node

require('shelljs/global')

var program = require('commander')

function clean () {
  rm('-rf', 'themes')
}

function dist () {
  mkdir('-p', 'themes')

  // clone theme
  exec('git clone --depth 1 --branch master git@github.com:bergos/hexo-theme-bergos.git themes/bergos')

  // install depenencies
  cd('themes/bergos')
  exec('npm install')
  exec('node install')
  cd('../..')
}

program
  .command('clean')
  .action(clean)

program
  .command('dist')
  .action(dist)

program.parse(process.argv)
