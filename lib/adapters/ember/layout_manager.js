var Ember = require('ember');
var _ = require("lodash");
var ComponentLookup = require("./component_lookup");

var EmberLayoutManager = function(options) {
	options = options || {};
	this.rootElement = options.rootElement || 'body';
	this._activeViews = {};
	this._outlets = {};
};

var default_template = Ember.Handlebars.compile("{{outlet}}");
var default_view_class = Ember.View.extend({
	template: default_template
});

EmberLayoutManager.prototype = {
	defaultControllerClass: Ember.ObjectController,
	defaultViewClass: default_view_class,
	setup: function(app) {
    Ember.Handlebars.registerHelper('action', Ember.Handlebars.helpers['action']);
		Ember.Handlebars.registerHelper('genURL', function(route_name, options) { return app.router.location.formatURL(app.router.generate(route_name, options.hash)); });
    app.eventDispatcher = Ember.EventDispatcher.create();
    if (!window.a) {
      app.eventDispatcher.setup();
      window.a = true;
    }

		var container = new Ember.Container();
    var resolver = Ember.DefaultResolver.create({ });

    container.optionsForType('component', { singleton: false });
    container.optionsForType('view', { singleton: false });
    // if we don't configure it the container tries to instantiate partials
    container.optionsForType('template', { instantiate: false });
    container.optionsForType('helper', { instantiate: false });
    container.resolver = function(fullName) {
      return resolver.resolve(fullName);
    };
    container.register("component-lookup:main", ComponentLookup);
		app.container = container;

		Ember.View.reopen({
      _injectObjects: Ember.on("init", function() {
        this.set('container', container);
				this.set('router', app.router);
      })
    });


	},
	lookupActiveView: function(routeName) {
    return this._activeViews[routeName];
  },
  registerActiveView: function(routeName, view) {
    this._activeViews[routeName] = view;
  },
  createView: function(view, ctx) {
		var controller = this.buildController(ctx);
    return view.create({ controller: controller });
  },
	createController: function(controller_class, context) {
		return controller_class.create(context);
	},
	exit: function (ctx) {
		var current_route = ctx.transition.getCurrentRoute();
		this.destroyView(current_route.name);
		ctx.transition.next(ctx);
	},
  _extractOptionsToRender: function(ctx) {
    var current_route = ctx.transition.getCurrentRoute();
    var parent_route = ctx.transition.getPreviousRoute();
    // if there is no handler, create a basic one
    view_class = current_route.handler.view
    return {
      view: view_class,
      outlet: current_route.handler && current_route.handler.outlet ? ctx.current_route.handler.outlet : "main",
      into: parent_route? parent_route.name : null
    };
  },
	enter: function (ctx) {
		var current_route = ctx.transition.getCurrentRoute();
		var view_instance = null;

		view_instance = this.lookupActiveView(current_route.name);
		if (!view_instance) {
			view_instance = this.render(current_route.name, current_route.handler.view, ctx);
		}
		this.updateContext(view_instance, ctx);
		return view_instance;
	},
	updateContext: function(view, ctx) {
		var current_route = ctx.transition.getCurrentRoute();
		var controller = view.get('controller');
		controller.setProperties({ params: current_route.params });
	},
	buildController: function(ctx) {
		var current_route = ctx.transition.getCurrentRoute();
		var controller_class = current_route.handler.controller || this.defaultControllerClass;
		var context = {
			params: current_route.params,
			content: {}
		};
		return this.createController(controller_class, context);
	},
  render: function(view_name, view_class, ctx) {
    var options = this._extractOptionsToRender(ctx);
    if (view_class) {
      options.view = view_class;
    }
    var parentView = this.lookupActiveView(options.into);
    var view = null;
    if (!parentView) {
       view = this.lookupActiveView(view_name);
       if (!view) {
        view = this.createView(options.view, ctx);
        view.appendTo(this.rootElement);
        this.registerActiveView(view_name, view);
       }
    }
    else {
      view = this.lookupActiveView(view_name);
      if (!view) {
        view = this.createView(options.view, ctx);
        this.registerActiveView(view_name, view);
      	this.connectView(options.into, view_name, { outlet: options.outlet });
      }
    }
		view.set('renderedName', view_name);
		return view;
  },
  connectView: function(parent_view_name, view_name, options) {
		var parentView = this.lookupActiveView(parent_view_name);
		var view = this.lookupActiveView(view_name);
    parentView.connectOutlet(options.outlet, view);
		var outlets = null;
		if (!(outlets = this._outlets[parent_view_name])) {
			outlets = {};
		}
		outlets[options.into || "main"] = view_name;
		this._outlets[parent_view_name] = outlets;
    view.set('___parentView', parentView);
  },
	_findOutletName: function(parent_view_name, view_name) {
		var outlets = this._outlets[parent_view_name];
		if (outlets) {
			for (var key in outlets) {
				if(outlets.hasOwnProperty(key) && key !== "toString"){
					if (outlets[key] == view_name) {
						return key;
					}
				}
			}
		}
		return null;
	},
	_findViewName: function(view) {
		for (var key in this._activeViews) {
      if(this._activeViews.hasOwnProperty(key) && key !== "toString"){
        if (this._activeViews[key] == view) {
					return key;
				}
      }
    }
		return null;
	},
  destroyView: function(view_name) {
		var view = this.lookupActiveView(view_name);
    var parentView = view.get('___parentView');
		var parent_view_name = this._findViewName(parentView);
    if (parentView) {
			var outlet = this._findOutletName(parent_view_name, view_name);
      parentView.disconnectOutlet(outlet);
			delete this._outlets[parent_view_name][outlet];
    }
    view.destroy();
		this.registerActiveView(view_name, null);
  }
};

module.exports = EmberLayoutManager;