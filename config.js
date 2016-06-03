System.config({
  baseURL: "./",
  defaultJSExtensions: true,
  transpiler: "traceur",
  paths: {

    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  /*bundles: {
    "build": [
      "github:tildeio/route-recognizer@0.1.11/dist/route-recognizer.cjs",
      "github:tildeio/route-recognizer@0.1.11",
      "flx/adapters/ractive/layout_manager.js",
      "flx/routing/router.js",
      "flx/application.js"
    ]
  },*/

  map: {
    "jquery": "github:components/jquery@2.1.1",
    "lodash": "npm:lodash@4.13.1",
    "ractive": "github:ractivejs/ractive@0.7.2",
    "route-recognizer": "github:tildeio/route-recognizer@0.1.11",
    "rsvp": "npm:rsvp@3.0.18",
    "text": "github:systemjs/plugin-text@0.0.8",
    "traceur": "github:jmcriffey/bower-traceur@0.0.93",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.93",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@4.13.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
