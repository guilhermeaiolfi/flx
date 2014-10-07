var RouteRecognizer = require("github:tildeio/route-recognizer").default;
var _ = require("github:lodash/lodash-amd");

var HashLocation = function (options) {
  this.location = window.location;
  this.router = options.router;
}
HashLocation.prototype = {
  getURL: function() {
    return this.router.getHash().substr(1);
  },
  setURL: function(path) {
    this.location.hash = path;
  },
  onUpdateURL: function(callback) {
    var self = this;

    jQuery(window).on('hashchange.ember-location-'+_.uniqueId('location_'), function() {
        var path = self.getURL();
        callback(path);
    });
  },
}

var Transition = function() {
  this.routes = [];
  this.url = null;
}
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
}

var Router = function(options) {
  options || (options = {});
  this.recognizer = new RouteRecognizer();
  this.handlers = {};
  this._activeViews = {};
  this._currentTransition = null;
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
  render: function(routeName, child_view, options) {
    var parentView = options.parentView;
    if (!parentView) {
       var view = this.lookupActiveView(routeName);
       if (!view) {
        view = child_view.create();
        view.appendTo(this.rootElement);
        this.registerActiveView(routeName, view);
       }
    }
    else {
      var view = this.lookupActiveView(routeName);
      if (!view) {
        view = child_view.create();
        this.registerActiveView(routeName, view);
      }
      console.log("rendering", routeName, parentView, view);
      parentView.connectOutlet("main", view);
      view.set('parentView', parentView);
    }
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
    this.location.onUpdateURL(function(url) {
      self.handleURL(url);
    });
  },
  handleURL: function(url) {
    this.navegate(url, true);
  },
  getHash: function () {
    // AutoLocation has it at _location, HashLocation at .location.
    // Being nice and not changing
    var href = this.location.location.href;
    var hashIndex = href.indexOf('#');

    if (hashIndex === -1) {
      return '';
    } else {
      return href.substr(hashIndex);
    }
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
    debugger;
    _.merge(this.handlers, handlers);
  },
  addHandler: function(name, handler) {
    this.handlers[name] = handler;
  }
}

module.exports = Router;