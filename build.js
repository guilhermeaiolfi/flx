var Builder = require('systemjs-builder');

var builder = new Builder();

builder.loadConfigSync('config.js');

builder.bundle('main.js - jquery - ractive - lodash', 'dist/flx.js').then(function() {
  console.log('Build complete');
});

builder.buildStatic('main.js + lib/* + route-recognizer - github:components/jquery@2.1.1.js - github:ractivejs/ractive@0.7.2.js - npm:lodash@4.13.1.js', 'dist/flx-sfx.js').then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});
