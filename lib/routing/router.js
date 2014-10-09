var RouteRecognizer = require("github:tildeio/route-recognizer").default;
var _ = require("github:lodash/lodash-amd");

var Router = function(options) {
  options || (options = {});
	this.application = options.application;
  this.recognizer = new RouteRecognizer();
  this.handlers = {};
  this._currentTransition = null;
  this.location = new HashLocation({ router: this });
};

Router.prototype = {
	getCurrentTransition: function() {
		return this._currentTransition;
	},
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

  createTransitionFromUrl: function(url) {
    var routes = this.recognizer.recognize(url);
    Ember.assert("There is no matching URL (" + url + ")", routes !== undefined);
    var transition = new Transition(this);
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
        }
        else if (_.isObject(handler)) {
        	normalized_handler = handler;
					if (!_.isFunction(handler.enter)) {
						normalized_handler.enter = function(ctx) {
							this.lm.enter.call(this.lm, ctx);
							ctx.transition.next(ctx);
						}
					}
					if (!_.isFunction(handler.exit)) {
						normalized_handler.exit = function(ctx) {
							this.lm.exit.call(this.lm, ctx);
							ctx.transition.next(ctx);
						}
					}
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

  executeTransition: function(enter_transition) {
		var route = null;
		var current_transition = this._currentTransition;
    if (current_transition != null) {
      var routes_to_exit = this.routesToExit(current_transition, enter_transition);
			var exit_transition = new Transition(this, routes_to_exit);
      var ctx = {
        router: this,
        transition: exit_transition,
				rootElement: this.application.rootElement,
        event: 'exit'
      };
      exit_transition.next(ctx);
    }
		var ctx = {
			router: this,
			transition: enter_transition,
			rootElement: this.application.rootElement,
			event: 'enter'
		};
    enter_transition.next(ctx);

    this._currentTransition = enter_transition;
  },

  start: function(options) {
   options = options || {};
    if (this.running) return;
    this.running = true;
    var url = this.getURL();
    this.handleURL(url);
    var self = this;
    this.location.setUpdateURLCallback(function(url) {
      self.handleURL(url, true);
    });
  },

  navegate: function(url, dont_update_url) {
    var transition = this.createTransitionFromUrl(url);
    this.executeTransition(transition);
    if (!dont_update_url) {
      this.setURL(url);
    }
  },
  handleURL: function(url) {
    this.navegate(url, false);
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
    return this.recognizer.generate(route_name, split_params);
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
		this.lastSetURL = path;
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
				if (self.lastSetURL === path) { return; }
				this.lastSetURL = null;
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


var Transition = function(router, routes) {
	this.router = router;
  this.routes = routes || [];
  this.url = null;
	this._currentIndex = -1;
};
Transition.prototype = {
	rewind: function() {
		this._currentIndex = -1;
	},
	next: function(ctx) {
		var route = this.routes[++this._currentIndex];
		if (ctx.route = route) {
			Ember.Logger.log("[" + ctx.event + "] " + route.name);
			route.handler[ctx.event].apply(this.router.application,[ctx]);
		}
		return route;
	},
	getPreviousRoute: function() {
		return this.routes[this._currentIndex - 1];
	},
	getNextRoute: function() {
		return this.routes[this._currentIndex + 1];
	},
	getCurrentRoute: function() {
		return this.routes[this._currentIndex];
	},
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