//jshint strict: false
module.exports = function(config) {
  config.set({
    basePath: 'src/',
      singleRun:true,
      files: [
	'lib/js/node-modules/angular/angular.js',
	'lib/js/node-modules/**/*.min.js',
	'lib/js/node-modules/angular-mocks/angular-mocks.js',
	'common/*.app.js',
	'common/**/*.js',
	'WebContent/admin/*.app.js',
	'WebContent/admin/**/*.app.js',
	'WebContent/admin/**/*.js'
    ],

    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['Safari', 'Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
