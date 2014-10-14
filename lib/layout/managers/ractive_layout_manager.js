var Ractive = require('github:ractivejs/ractive');

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
  createView: function(view, ctx) {
    return new view({ data: { helpers: this.helpers } });
  },

	exit: function (ctx) {
		var current_route = ctx.transition.getCurrentRoute();
		this.destroyView(current_route.name);
		ctx.transition.next(ctx);
	},
	enter: function (ctx) {
		var current_route = ctx.transition.getCurrentRoute();
		var parent_route = ctx.transition.getPreviousRoute();
		var view_class = null;
		var view_instance = null;
		var controller_class = null;
		var context = {
			params: current_route.params
		};

		// if there is no handler, create a basic one
		view_class = current_route.handler.view || this.defaultViewClass;
		var options = {
			view: view_class,
			into: parent_route? parent_route.name : null
		};

		view_instance = this.lookupActiveView(current_route.name);
		if (!view_instance) {
			view_instance = this.render(current_route.name, options);
		}
		this.updateContext(view_instance, ctx);
		return view_instance;
	},
	updateContext: function(view, ctx) {
		var current_route = ctx.transition.getCurrentRoute();
		view.set("params", current_route.params);
	},

  render: function(view_name, options) {
		var view_class = options.view;
		var into = options.into || this.rootElement;
    var view = this.lookupActiveView(view_name);
    if (!view) {
    	view = this.createView(view_class);
      this.registerActiveView(view_name, view);
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