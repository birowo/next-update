#!/usr/bin/env node

var q = require('q');
q.longStackSupport =  true;

var nextUpdate = require('../src/next-update');
var program = require('../src/cli-options');

var pkg = require('../package.json');
var info = pkg.name + '@' + pkg.version + ' - ' + pkg.description;

var report = require('../src/report').report;
var revert = require('../src/revert');

if (program.available) {
  nextUpdate.available(program.module, {
    color: program.color
  }).done();
} else if (program.revert) {
  revert(program.module)
    .then(function () {
      console.log('done reverting');
    }, function (error) {
      console.error('error while reverting\n', error);
    });
} else {
  if (!program.tldr) {
    console.log(info);
  }

  var updateNotifier = require('update-notifier');
  updateNotifier({
    pkg: pkg,
    name: pkg.name,
    version: pkg.version
  }).notify();

  var opts = {
    names: program.module,
    latest: program.latest,
    testCommand: program.test,
    all: program.all,
    color: program.color,
    keep: program.keep,
    allow: program.allowed || program.allow,
    type: program.type,
    tldr: program.tldr
  };

  var checkCurrent = nextUpdate.checkCurrentInstall.bind(null, opts);
  var checkCurrentState = program.skip ? q : checkCurrent;
  var checkUpdates = nextUpdate.checkAllUpdates.bind(null, opts);

  var reportTestResults = function reportTestResults(results) {
    if (Array.isArray(results)) {
      return report(results, {
        useColors: program.color,
        keptUpdates: program.keep,
        changedLog: program['changed-log']
      });
    }
  };

  checkCurrentState()
    .then(checkUpdates)
    .then(reportTestResults)
    .catch(function (error) {
      console.error('ERROR testing next working updates');
      if (error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    });
}
