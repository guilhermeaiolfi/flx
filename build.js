var Builder = require('systemjs-builder');

var builder = new Builder();

builder.loadConfigSync('config.js');

builder.bundle('main.js - jquery - ractive - lodash', 'dist/flx.js').then(function() {
  console.log('Build complete');
});

builder.buildStatic('main.js + lib/* + route-recognizer - jquery - ractive - lodash', 'dist/flx-sfx.js').then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});
