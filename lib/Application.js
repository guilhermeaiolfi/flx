var Ember = require("ember");
var Router = require('./routing/router');

var Application = Ember.Object.extend({
  init: function() {
    this.router = new Router({ application: this });
    this.lm.setup(this);
  }
});

module.exports = Application;