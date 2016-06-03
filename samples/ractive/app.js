var Application = require("lib/Application.js");
var Ractive = require("ractive");
var RactiveLayoutManager = require("lib/adapters/ractive/layout_manager.js");
var PostEditView = require("samples/ractive/post/edit/view.js");
var PostIndexView = require("samples/ractive/post/index/view.js");
var PostView = require("samples/ractive/post/view.js");


var app = window.app = new Application(new RactiveLayoutManager({ rootElement: '.app1' }));

app.router.map(function(match) {
	match("/").to("application", function(match) {
    match("/").to("application");
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