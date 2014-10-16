var Application = require("lib/application");
var Router = require("lib/routing/router");
var Router = require("lib/adapters/ember/layout_manager");
var lib = {};
lib.Application = Application;
lib.Router = Router;
lib.adapters = {};
lib.adapters.ember = {};
lib.adapters.ember.LayoutManager = EmberLayoutManager;


module.exports = lib;