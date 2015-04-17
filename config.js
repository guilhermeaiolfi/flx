System.config({
  "paths": {
    "flx/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "lodash": "jspm_packages/npm/lodash-node@2.4.1/modern/index.js",
    "lib/*": "lib/*.js",
    "*": "*.js",
    "~/*": "lib/*.js"
  },
  "bundles": {
    "build": [
      "github:tildeio/route-recognizer@0.1.1/dist/route-recognizer.cjs",
      "github:tildeio/route-recognizer@0.1.1",
      "lib/adapters/ractive/layout_manager",
      "lib/routing/router",
      "lib/application",
      "flx"
    ]
  }
});

System.config({
  "map": {
    "jquery": "github:components/jquery@2.1.1",
    "lodash": "npm:lodash@3.7.0",
    "ractive": "github:ractivejs/ractive@0.7.2",
    "route-recognizer": "github:tildeio/route-recognizer@0.1.1",
    "rsvp": "npm:rsvp@3.0.18",
    "text": "github:systemjs/plugin-text@0.0.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.87",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.87",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs@0.0.7": {
      "Base64": "npm:Base64@0.2.1",
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.4",
      "inherits": "npm:inherits@2.0.1",
      "json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

