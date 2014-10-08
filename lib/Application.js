var Ember = require("ember");
var Router = require('./routing/router');

var Application = Ember.Object.extend({
  init: function() {
    this.router = new Router();
    this.setupRouter();
    this.setupContainer();
  },
  setupContainer: function() {
    Ember.Handlebars.registerHelper('action', Ember.Handlebars.helpers['action']);
    this.eventDispatcher = Ember.EventDispatcher.create();
    if (!window.a) {
      this.eventDispatcher.setup();
      window.a = true;
    }
    var container = null;
    this.container = container = new Ember.Container();
    Ember.View.reopen({
      _injectContainer: Ember.on("init", function() {
        this.set('container', container);
      })
    });
  },
  setupRouter: function() {
    this.router.rootElement = this.get('rootElement');
  }
});

module.exports = Application;