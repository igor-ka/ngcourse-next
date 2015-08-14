module.exports = function (config) {

  config.set({
    
    files : [
      { pattern: 'node_modules/**/*.js', served: true, included: false, watched: true },
      { pattern: 'bower_components/**/*.js', served: true, included: false, watched: true },
      { pattern: 'output/js/**/*.js', served: true, included: false, watched: true }
    ],
    
    exclude: [
      'node_modules/**/*test.js', 
      'node_modules/**/*spec.js',
      'bower_components/**/*test.js', 
      'bower_components/**/*spec.js'
    ],
    
    systemjs: {
      // Path to your SystemJS configuration file 
      configFile: 'output/system.config.test.js'
    },
    
    // plugins: ['karma-mocha', 'karma-chai', 'karma-sinon', 'karma-systemjs', 'karma-chrome-launcher'],
    
    frameworks: ['mocha', 'chai', 'sinon', 'systemjs'],

    preprocessors: {
      'output/js/**/*.js': ['coverage']
    },

    reporters: ['mocha', 'coverage'],
    
    coverageReporter: {
      reporters: [{
        type: 'json'
      }, {
          type: 'html'
        }, {
          type: 'text-summary'
        }],
      dir: 'output/coverage'
    },

    port: 9999,

    colors: true,

    //logLevel: config.LOG_DEBUG,
    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'], // Alternatively: 'PhantomJS'
    
    captureTimeout: 6000,

    singleRun: true

  });
};