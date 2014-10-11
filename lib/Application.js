var Ember = require("ember");
var Router = require('./routing/router');

var Application = Ember.Object.extend({
  init: function() {
    this.router = new Router({ application: this });
    this.setupRouter();
    this.setupContainer();
  },
  setupContainer: function() {
		var app = this;
    Ember.Handlebars.registerHelper('action', Ember.Handlebars.helpers['action']);
		Ember.Handlebars.registerHelper('url', function(route_name, options) { return app.router.location.formatURL(app.router.generate(route_name, options.hash)); });
    this.eventDispatcher = Ember.EventDispatcher.create();
    if (!window.a) {
      this.eventDispatcher.setup();
      window.a = true;
    }
    var container = this.buildContainer();
    Ember.View.reopen({
      _injectContainer: Ember.on("init", function() {
        this.set('container', container);
      })
    });
		this.container = container;
  },
	buildContainer: function() {
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
		return container;
	},
  setupRouter: function() {
  }
});

module.exports = Application;