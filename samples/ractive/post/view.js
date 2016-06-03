var Ractive = require("ractive");
var template = require("samples/ractive/post/template.hbs!text");

module.exports =  Ractive.extend({
  //controller: Controller.create(),
	el: ".application-outlet",
  template: template,

});
