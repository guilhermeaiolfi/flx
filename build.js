var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder({
  //baseURL: 'file:' + path.resolve('flx'),
});

builder.loadConfig('./config.js');

builder.build('main - jquery - ractive - lodash', 'dist/flx.js').then(function() {
  console.log('Build complete');
});

builder.buildSFX('main + lib/* + route-recognizer', 'dist/flx-sfx.js').then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});
