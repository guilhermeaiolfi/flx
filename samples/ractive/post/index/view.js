var Ractive = require("ractive");
var template = require("samples/ractive/post/index/template.hbs!text");

module.exports = Ractive.extend({
  template: template,
//	data: {
//		items: [{name: "Gulherme Aiolfi"}, { name: "John Snow"} ]
//	},
	el: ".post-outlet"
});