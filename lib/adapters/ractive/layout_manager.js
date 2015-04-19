var Ractive = require('ractive');

var RactiveLayoutManager = function(options) {
  options = options || {};
  this.rootElement = options.rootElement || 'body';
  this._activeViews = {};
};

RactiveLayoutManager.prototype = {
  defaultViewClass: Ractive,
  setup: function(app) {
    this.helpers = {};
    this.helpers.genURL = function(name, params) {
      return app.router.location.formatURL(app.router.generate(name, params));
    }
  },
  lookupActiveView: function(routeName) {
    return this._activeViews[routeName];
  },
  registerActiveView: function(routeName, view) {
    this._activeViews[routeName] = view;
  },

  exit: function (ctx) {
    var current_route = ctx.transition.getCurrentRoute();
    this.destroyView(current_route.name);
    ctx.transition.next(ctx);
  },
  enter: function (ctx) {
    var current_route = ctx.transition.getCurrentRoute();
    var view_class = null;
    var view = null;
    var context = {
      params: current_route.params
    };
    var params = jQuery.extend(ctx.transition.routes.queryParams, current_route.params);

    // if there is no handler, create a basic one
    view_class = current_route.handler.view || this.defaultViewClass;

    view = this.lookupActiveView(current_route.name);
    if (!view) {
      view = new view_class({
        data: function() {
          {
            helpers: this.helpers,
            params: params
          }
        }
      });
      this.registerActiveView(current_route.name, view);
    }
    else {
      view.set("params", params);
    }
    return view;
  },

  destroyView: function(view_name) {
    var view = this.lookupActiveView(view_name);
    view.teardown();
    this.registerActiveView(view_name, null);
  }
};

module.exports = RactiveLayoutManager;
