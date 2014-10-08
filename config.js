System.config({
  "paths": {
		"flx/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "lodash": "jspm_packages/npm/lodash-node@2.4.1/modern/index.js",
    "*": "*.js"
  }
});

System.config({
  "map": {
    "ember": "github:components/ember@^1.7.0/ember.src",
    "github:components/ember@1.7.0": {
      "jquery": "github:components/jquery@^2.1.1",
      "handlebars.js": "github:components/handlebars.js@^1.3.0"
    },
    "github:tildeio/route-recognizer": "github:tildeio/route-recognizer@^0.1.1",
    "npm:Base64@0.2.1": {},
    "npm:inherits@2.0.1": {},
    "npm:ieee754@1.1.4": {},
    "npm:base64-js@0.0.7": {},
    "github:jspm/nodelibs@0.0.3": {
      "Base64": "npm:Base64@0.2",
      "base64-js": "npm:base64-js@0.0",
      "ieee754": "npm:ieee754@^1.1.1",
      "inherits": "npm:inherits@^2.0.1",
      "json": "github:systemjs/plugin-json@master"
    },
    "npm:lodash-node@2.4.1": {},
    "npm:lodash-node": "npm:lodash-node@^2.4.1",
    "underscore": "npm:underscore@^1.7.0",
    "npm:underscore@1.7.0": {},
    "github:lodash/lodash-amd": "github:lodash/lodash-amd@^2.4.1"
  }
});

System.config({
  "versions": {
    "github:components/ember": "1.7.0",
    "github:components/handlebars.js": "1.3.0",
    "github:components/jquery": "2.1.1",
    "github:flatiron/director": "1.2.2",
    "github:tildeio/route-recognizer": "0.1.1",
    "npm:lodash-node": "2.4.1",
    "github:jspm/nodelibs": "0.0.3",
    "npm:Base64": "0.2.1",
    "npm:inherits": "2.0.1",
    "github:systemjs/plugin-json": "master",
    "npm:ieee754": "1.1.4",
    "npm:base64-js": "0.0.7",
    "npm:underscore": "1.7.0",
    "github:lodash/lodash-amd": "2.4.1"
  }
});

