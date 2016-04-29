// Karma configuration
// Generated on Tue Feb 10 2015 14:46:14 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'node_modules/chart.js/dist/Chart.min.js',
      'node_modules/angular-chart.js/dist/angular-chart.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/mathjs/dist/math.js',
      'src/app.js',
      'src/**/*.js',
      //And your specs
      'tests/**/*.test.js'
    ],
    exclude: [
    ],
    reporters: ['nicer'], //'dots', 'progress' 
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['PhantomJS'],//'Chrome' PhantomJS
    singleRun: true,
    concurrency: Infinity
  });
};
