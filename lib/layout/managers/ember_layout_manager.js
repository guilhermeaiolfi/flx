var Ember = require('ember');

var EmberLayoutManager = function(options) {
	options = options || {};
	this.rootElement = options.rootElement || 'body';
	this._activeViews = {};
	this._outlets = {};
};
var default_template = Ember.Handlebars.compile("|{{outlet}}|");
var default_view_class = Ember.View.extend({
	template: default_template
});
EmberLayoutManager.prototype = {
	defaultViewClass: default_view_class,
	lookupActiveView: function(routeName) {
    var view = this._activeViews[routeName];
    return view;
  },
  registerActiveView: function(routeName, view) {
    this._activeViews[routeName] = view;
  },
  createView: function(view) {
    return view.create();
  },
	createController: function(controller_class) {
		return controller_class.create({});
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

		if (parent_route) {
			ctx.parentViewName = parent_route.name;
		}
		// if there is no handler, create a basic one
		view_class = current_route.handler.view || this.defaultViewClass;
		view_instance = this.render(current_route.name, view_class, ctx);

		if (controller_class = current_route.handler.controller) {
			context.controller = this.createController(controller_class);
			view_instance.set('controller', context.controller);
		}
		view_instance.set('context', context);
		return view_instance;
	},
  render: function(view_name, view_to_render, options) {
		var parent_view_name = options.parentViewName;
    var parentView = this.lookupActiveView(parent_view_name);
    var view = null;
    if (!parentView) {
       view = this.lookupActiveView(view_name);
       if (!view) {
        view = this.createView(view_to_render);
        view.appendTo(this.rootElement);
        this.registerActiveView(view_name, view);
       }
    }
    else {
      view = this.lookupActiveView(view_name);
      if (!view) {
        view = this.createView(view_to_render);
        this.registerActiveView(view_name, view);
      }
      this.connectView(parent_view_name, view_name, { into: options.into || "main" });
    }
		return view;
  },
  connectView: function(parent_view_name, view_name, options) {
		var parentView = this.lookupActiveView(parent_view_name);
		var view = this.lookupActiveView(view_name);
    parentView.connectOutlet(options.into, view);
		var outlets = null;
		if (!(outlets = this._outlets[parent_view_name])) {
			outlets = {};
		}
		outlets[options.into || "main"] = view_name;
		this._outlets[parent_view_name] = outlets;
    view.set('parentView', parentView);
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
    var parentView = view.get('parentView');
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