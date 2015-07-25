/* global Promise */
/* global System */
/* global __karma__ */
/**
 * test-runner.js: force karma to work how we want so we can run the tests as transpiled es6 ts modules.
 * A LOT of credit is due to the Angular 2 team who appear to be the only people to get this to work (but they dont talk about it).
 * 
 * The idea is to pause karma, 
 *  then load all of our test modules (which are not loaded through the script tag, since that breaks the module system),
 *  and  finally run karma for each one.
 * Karma would just blast through this file and exit with out running the loaded tests.
 */
__karma__.loaded = function () { }; //hack karma, and tell it to start when we are ready;; thanks angular 2

System.baseURL = '/base/.tmp/serve/'; //where we keep our test files
System.paths = {
  '*': './*.js',
  'chai': '/base/node_modules/chai/chai.js'
};

function onlySpecFiles(path) {
  return /.test\.js$/.test(path);
}

function karmaFileToModule(fileName) {
  console.log(fileName);
  return fileName.replace(System.baseURL, '')
    .replace('.js', '');
}

var promisedTests = 
  Object.keys(window.__karma__.files) // All files served by Karma.
    .filter(onlySpecFiles)
    .map(karmaFileToModule)
    .map(function (modName) {
      return System.import(modName)
        .then(function (mod) {
          if (mod.hasOwnProperty('main')) {
            mod.main();
          } else {
            throw new Error('Module ' + modName + ' does not implement main() method.');
          }
        });
    });
    
Promise.all(promisedTests)
  .then(
    function () {
      __karma__.start();
    },
    function (error) {
      console.error('Error', error.stack || error);
      __karma__.start();
    })
    .then(
      null, 
      function (error) {
        console.error('Failed to load:', error); 
      }
    );