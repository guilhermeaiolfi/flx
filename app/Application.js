var Ember = require("ember");

var Router = require('app/router');

var Application = Ember.Object.extend({
  rootElement: 'body',
  init: function() {
    this.router = new Router();
    this.setupRouter();
  },
  setupRouter: function() {
    this.router.rootElement = this.get('rootElement');
  }
});

module.exports = Application;