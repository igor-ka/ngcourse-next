var marked = require('marked');
var fs = require('fs');
var highlightjs = require('highlight.js');
var typogr = require('typogr');

var parts = [
  '00-setup.md',
  '01-introduction.md',
  '02-toolchain.md',
  '03-javascript.md',
  '04-es6.md',
  '05-components.md',
  '06-unit-testing-intro.md',
  '07-rest-apis.md',
  '08-promises.md',
  '09-services.md',
  '10-advanced-promises.md',
  '11-unit-testing-services.md',
  '12-rxjs.md',
  '13-flux.md',
  '14-unit-testing-flux-components.md',
  '15-routing.md'
];

// Synchronous highlighting with highlight.js
marked.setOptions({
  highlight: function (code) {
    return highlightjs.highlightAuto(code).value;
  }
});

var buffer = fs.readFileSync('header.html', 'utf8');
buffer = buffer.replace('{{date}}', new Date().toLocaleDateString());

parts.forEach(function(filePath) {
  var markdownString = fs.readFileSync(filePath, 'utf8');
  buffer += marked(markdownString);
});

buffer += '</body></html>';
buffer = buffer.replace(/&quot;/g, '"');
buffer = buffer.replace(/&#39;/g, '\'');

buffer = typogr(buffer).typogrify();

console.log(buffer);
