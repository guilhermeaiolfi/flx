var Ember = require('ember');
var Application = require("flx/Application");
var RactiveLayoutManager = require("flx/adapters/ractive/layout_manager");
var PostEditView = require("samples/ractive/post/edit/view");
var PostIndexView = require("samples/ractive/post/index/view");
var PostView = require("samples/ractive/post/view");


var app = window.app = Application.create({
	lm: new RactiveLayoutManager({ rootElement: '.app1' })
});

app.router.map(function(match) {
	match("/").to("application", function(match) {
		match("/posts").to("post",function(match) {
			match("/").to("post.index");
			match("/:id").to("post.edit");
		});
	});
});

var ApplicationView = Ractive.extend({
	el: ".app1",
	template: "oi<br /><div class=\"application-outlet\"></div>"
});

app.router.addHandlers({
	"application": {
		view: ApplicationView
	},
  "post": {
    view: PostView
  },
  "post.index": {
		view: PostIndexView
	},
  "post.edit": {
    view: PostEditView,
    controller: null
  }
});

app.router.start();

module.exports = app;