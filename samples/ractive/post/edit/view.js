var Ractive = require("github:ractivejs/ractive");
var template = require("samples/ractive/post/edit/template.hbs!text");

module.exports = Ractive.extend({
  template: template,
	el: ".post-outlet",
	data: {
		url: "post.index"
	}
});