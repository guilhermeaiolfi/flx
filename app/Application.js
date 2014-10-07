var Ember = require("ember");

var Router = require('app/router');

var Application = Ember.Object.extend({
  rootElement: 'body',
  init: function() {
    this.router = new Router();
    this.setupRouter();
    this.setupContainer();
  },
  setupContainer: function() {
    Ember.Handlebars.registerHelper('action', Ember.Handlebars.helpers['action']);
    this.eventDispatcher = Ember.EventDispatcher.create();
    this.eventDispatcher.setup();
    this.container = new Ember.Container();
  },
  setupRouter: function() {
    this.router.rootElement = this.get('rootElement');
  }
});

module.exports = Application;