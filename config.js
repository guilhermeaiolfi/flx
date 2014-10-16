System.config({
  "paths": {
    "flx/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "lodash": "jspm_packages/npm/lodash-node@2.4.1/modern/index.js",
    "*": "*.js"
  },
  "bundles": {
    "build": [
      "github:tildeio/route-recognizer@0.1.1/dist/route-recognizer.cjs",
      "lib/adapters/ember/component_lookup",
      "github:tildeio/route-recognizer@0.1.1",
      "lib/adapters/ember/layout_manager",
      "lib/routing/router",
      "lib/application",
      "flx"
    ]
  }
});

System.config({
  "map": {
    "ember": "github:components/ember@^1.8.0-beta.4",
    "route-recognizer": "github:tildeio/route-recognizer@^0.1.1",
    "lodash": "github:lodash/lodash-amd@^2.4.1",
    "text": "github:systemjs/plugin-text@^0.0.2",
    "github:components/ember@1.8.0-beta.4": {
      "jquery": "github:components/jquery@^2.1.1",
      "handlebars.js": "github:components/handlebars.js@^1.3.0"
    },
    "github:ractivejs/ractive": "github:ractivejs/ractive@^0.6.0",
    "github:lodash/lodash-amd": "github:lodash/lodash-amd@^2.4.1",
    "github:tildeio/route-recognizer": "github:tildeio/route-recognizer@^0.1.1",
    "jquery": "github:components/jquery@^2.1.1"
  }
});

System.config({
  "versions": {
    "github:components/ember": "1.8.0-beta.4",
    "github:components/handlebars.js": "1.3.0",
    "github:components/jquery": "2.1.1",
    "github:systemjs/plugin-json": "master",
    "github:systemjs/plugin-text": "0.0.2",
    "github:ractivejs/ractive": "0.6.0",
    "github:lodash/lodash-amd": "2.4.1",
    "github:tildeio/route-recognizer": "0.1.1"
  }
});

