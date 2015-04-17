var Router = require('./routing/router');

var Application = function(lm) {
  this.router = new Router({ application: this });
  this.lm = lm;
  this.lm.setup(this);
};

module.exports = Application;