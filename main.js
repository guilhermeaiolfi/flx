var Router = require("lib/routing/router.js");
var Application = require("lib/application.js");
var RactiveLayoutManager = require("lib/adapters/ractive/layout_manager.js");
var lib = {};
lib.Application = Application;
lib.Router = Router;
lib.adapters = {};
lib.adapters.ractive = {};
lib.adapters.ractive.LayoutManager = RactiveLayoutManager;


module.exports = lib;
