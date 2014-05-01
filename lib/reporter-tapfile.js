
var mocha = require('mocha'),
    fs = require('fs'),

    config = require('../config'),

    Base = mocha.reporters.Base,

    reporterName = process.env.MOCHA_REPORTER || config.reporter || 'TAP',
    Reporter = mocha.reporters[reporterName],

    filePath = process.env.MOCHA_REPORTER_FILE || config.file || process.cwd() + "/mocha_report.tap";



function ReporterFile(runner) {

    Reporter.call(this, runner);

    var stats = this.stats,
      tests = [],
      currentSuite = '',
      count = 0,
      writeErr;

    runner.on('suite', function(suite){
      currentSuite = suite.title;
    });

    runner.on('test', function(test){
      ++count;
    });

    runner.on('pass', function(test){
      var output = 'ok ' + count + ' ' + currentSuite + ' ' + test.title;
      tests.push(output);
    });

    runner.on('fail', function(test){
      var output = 'not ok ' + count + ' ' + currentSuite + ' ' + test.title;
      tests.push(output);
    });

    runner.on('pending', function(test) {
      var output = 'ok ' + count + ' # skip ' + currentSuite + ' ' + test.title;
      tests.push(output);
    });

    runner.on('end', function() {
      var output = "1.." + count;
      tests.push(output);

      writeErr = fs.writeFileSync(filePath, tests.join('\n') + '\n');

      if (writeErr) {
        throw writeErr;
      }

      console.log('> Report was written to: ' + filePath + '\n');

    });
}

// Inherit from the specified reporter
ReporterFile.prototype = Reporter.prototype;


module.exports = ReporterFile;
