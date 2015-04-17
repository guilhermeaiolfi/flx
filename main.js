var Router = require("lib/routing/router");
var RactiveLayoutManager = require("lib/adapters/ractive/layout_manager");
var lib = {};
lib.Application = Application;
lib.Router = Router;
lib.adapters = {};
lib.adapters.ractive = {};
lib.adapters.ractive.LayoutManager = RactiveLayoutManager;


module.exports = lib;
