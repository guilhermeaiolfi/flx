var RouteRecognizer = require("github:tildeio/route-recognizer").default;
var _ = require("github:lodash/lodash-amd");
var EmberRouterAdapter = require("./adapters/ember_adapter");

var Router = function(options) {
  options || (options = {});
  this.recognizer = new RouteRecognizer();
  this.handlers = {};
  this._activeViews = {};
  this._currentTransition = null;
  this.adapter = options.adapter || new EmberRouterAdapter(this);
  this.location = new HashLocation({ router: this });
};

Router.prototype = {
  lookupActiveView: function(routeName) {
    var view = this._activeViews[routeName];
    return view;
  },
  registerActiveView: function(routeName, view) {
    this._activeViews[routeName] = view;
  },
//  render: function(routeName, child_view, options) {
//    this.adapter.render.apply(this.adapter, arguments);
//  },

  map: function(callback) {
    this.recognizer.delegate = this.delegate;

    this.recognizer.map(callback, function(recognizer, routes) {
      for (var i = routes.length - 1, proceed = true; i >= 0 && proceed; --i) {
        var route = routes[i];
        recognizer.add(routes, { as: route.handler });
        proceed = route.path === '/' || route.path === '' || route.handler.slice(-6) === '.index';
      }
    });
  },

  navegate: function(url, silent) {
    var transition = this.createTransitionFromUrl(url);
    this.executeTransition(transition);
    if (!silent) {
      this.updateURL(url);
    }
  },

  createTransitionFromUrl: function(url) {
    var routes = this.recognizer.recognize(url);
    Ember.assert("There is no matching URL (" + url + ")", routes !== undefined);
    var transition = new Transition();
    transition.url = url;

    var ctx = null;
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      var normalized_handler = null;
      var handler = this.getHandler(routes[i].handler);
      var name = routes[i].handler;
      if (handler) {
        if (_.isFunction(handler)) {
          normalized_handler = {};
          normalized_handler.enter = handler;
          normalized_handler.exit = handler;
          normalized_handler.render = handler;
        }
        else if (_.isObject(handler)) {
         normalized_handler = handler;
        }
        //normalized_handler.name = name;
        route.handler = normalized_handler;
        route.name = name;
        transition.addRoute(route);
      }
      else {
        console.log("handler not found for " + routes[i].handler);
      }
    }
    return transition;
  },

  routesToExit: function (old_transition, new_transition) {
    var routes = [];
    for(var i = 0; i < old_transition.routes.length; i++) {
      var route = old_transition.routes[i];
      if (!new_transition.find(route)) {
        routes.push(route);
      }
    }
    return routes;
  },

  executeTransition: function(transition) {
    if (this._currentTransition != null) {
      var ctx = {
        router: this,
        transition: transition,
        event: 'exit'
      };
      var routes_to_exit = this.routesToExit(this._currentTransition, transition);

      for (var i = routes_to_exit.length - 1; i >= 0; i--) {
        routes_to_exit[i].handler.exit.apply(this, [ctx]);
      }
    }
    for (var i = 0; i < transition.routes.length; i++) {
      var route = transition.routes[i];
      var ctx = {
        router: this,
        route: route,
        transition: transition,
        event: 'render'
      };
      if (i > 0) {
        var parentRoute = transition.routes[i - 1];
        ctx.parentView = this.lookupActiveView(parentRoute.name);
      }
      if (!this._currentTransition || (this._currentTransition && !this._currentTransition.find(route))) {
        route.handler.render.apply(this,[ctx]);
      }
      ctx.event = 'enter';
      ctx.view = this.lookupActiveView(route.name);
      route.handler.enter.apply(this,[ctx]);
    }
    this._currentTransition = transition;
  },

  start: function(options) {
   options = options || {};
    if (this.running) return;
    this.running = true;
    //this.location = window.history.location || window.location;
    //if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    //if (false !== options.click) window.addEventListener('click', onclick, false);
    var url = this.getURL();
    this.handleURL(url);
    var self = this;
    this.location.setUpdateURLCallback(function(url) {
      self.handleURL(url);
    });
  },
  handleURL: function(url) {
    this.navegate(url, true);
  },
  getHash: function () {
  	return this.location.getHash();
  },
  getURL: function() {
    return this.location.getURL();
  },
  setURL: function(path) {
    this.location.setURL(path);
  },
  stop: function() {
    this.running = false;
  },
  updateURL: function(url) {
    this.location.setURL(url);
  },
  getHandler: function(name) {
    return this.handlers[name];
  },
  generate: function(route_name, params) {
    var route = this.recognizer.names[route_name];
    var param_names = [];
    var split_params = { queryParams: {} };
    for (var i = 0; i< route.segments.length; i++) {
      var segment = route.segments[i];
      if (segment.name) {
        split_params[segment.name] = params[segment.name];
        delete params[segment.name];
      }
    }
    split_params.queryParams = params;
    return this.location.formatURL(this.recognizer.generate(route_name, split_params));
  },
  addHandlers: function(handlers) {
    _.merge(this.handlers, handlers);
  },
  addHandler: function(name, handler) {
    this.handlers[name] = handler;
  }
};

/*
 * Locations classes
 *
 * HashLocation: uses hashes to go from page to page
 *
 * NoneLocation: basically a dumb location that does nothing
 *
 */
var HashLocation = function (options) {
  this.location = window.location;
  this.router = options.router;
	this.guid = _.uniqueId('location_');
}
HashLocation.prototype = {
  getURL: function() {
    return this.getHash().substr(1);
  },
	getHash: function() {
    // AutoLocation has it at _location, HashLocation at .location.
    // Being nice and not changing
    var href = this.location.href;
    var hashIndex = href.indexOf('#');

    if (hashIndex === -1) {
      return '';
    } else {
      return href.substr(hashIndex);
    }
	},
  setURL: function(path) {
    this.location.hash = path;
  },
	formatURL: function(url) {
		return '#' + url;
	},
	replaceURL: function(path) {
    this.location.replace('#' + path);
  },
  setUpdateURLCallback: function(callback) {
    var self = this;

    jQuery(window).on('hashchange.ember-location-'+this.guid, function() {
        var path = self.getURL();
        callback(path);
    });
  },
	destroy: function() {
		 jQuery(window).off('hashchange.ember-location-'+this.guid);
	}
};

var NoneLocation = function (options) {
	this.location = window.location;
  this.router = options.router;
	this.path = "";
};

NoneLocation.prototype = {
  getURL: function() {
    return this.path;
  },
	getHash: function() {
    return "";
	},
  setURL: function(path) {
    this.path = path;
  },
  setUpdateURLCallback: function(callback) {
		this.updateCallback = callback;
  },
	handleURL: function(url) {
		this.path = url;
    this.updateCallback(url);
	}
};


var Transition = function() {
  this.routes = [];
  this.url = null;
};
Transition.prototype = {
  addRoute: function (route) {
    this.routes.push(route);
  },
  find: function(route) {
    for (var i = 0; i < this.routes.length; i++) {
      var current_route = this.routes[i];
      if (current_route.name == route.name) {
        return route;
      }
    }
    return null;
  }
};

module.exports = Router;