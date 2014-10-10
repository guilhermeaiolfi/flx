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
		container.resolver = new Ember.DefaultResolver.create({
			resolve: function(name) {
				debugger;
				return Ember.TEMPLATES[name.split(":")[1]];
			}
		});
		return container;
	},
  setupRouter: function() {
  }
});

module.exports = Application;