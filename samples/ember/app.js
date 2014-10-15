var Ember = require('ember');
var Application = require("flx/Application");
var EmberLayoutManager = require("flx/layout/managers/ember_layout_manager");

var app = Application.create({
	lm: new EmberLayoutManager({ rootElement: '.app1' })
});

app.router.map(function(match) {
	match("/").to("application", function(match) {
		match("*:").to("load");
	});
});

var LoadingView = Ember.View.extend({
	template: function() { return "Loading..."; }
});

Ember.TEMPLATES['_menu'] = Ember.Handlebars.compile('<ul class="menu"><li>Menu item 1</li><li>Menu item 2</li></ul>');
var ApplicationView = Ember.View.extend({
	template: Ember.Handlebars.compile("{{outlet}}")
});

app.router.addHandlers({
	"application": {
		view: ApplicationView
	},
  "load": {
		enter: function(ctx) {
      var lm = this.lm;
      var router = this.router;
      var transition = ctx.transition;
      var url = transition.url;
      var module = url? url.split("/")[1] : "post";
      var route = transition.getCurrentRoute();
      lm.render("PostLoading", LoadingView, ctx);
      System.import("samples/ember/" + module + "/main").then(function() {
        //lm.destroyView("PostLoading");
        router.reload(transition);
      });
		}
  }
});

app.router.start();

module.exports = app;
//console.log(app.router.generate("post.edit", { id: 1, ok: 'nice' }));
//app.router.navegate("/posts/12");