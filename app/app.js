var Ember = require('ember');
var Application = require("flx/Application");
var EmberLayoutManager = require("flx/layout/managers/ember_layout_manager");
var PostEditView = require("app/post/edit/view");
var PostIndexView = require("app/post/index/view");
var PostView = require("app/post/view");


var app = Application.create({
	lm: new EmberLayoutManager({ rootElement: '.app1' })
});

app.router.map(function(match) {
	match("/").to("application", function(match) {
		match("/posts").to("post",function(match) {
			match("/").to("post.index");
			match("/:id").to("post.edit");
		});
	});
});

var interval = null;

var Controller = Ember.ObjectController.extend({
  actions: {
    navegate: function () {
      router.setRoute('/test');
    },
    something: function () {
      router.setRoute('/something');
    },
    reada: function() {
      console.log('read from controller');
    }
  }
});

var LoadingView = Ember.View.extend({
	template: function() { return "Loading..."; }
});

Ember.TEMPLATES['_menu'] = Ember.Handlebars.compile('<ul class="menu"><li>Menu item 1</li><li>Menu item 2</li></ul>');
var ApplicationView = Ember.View.extend({
	template: Ember.Handlebars.compile("/|{{partial \"menu\"}}|\\\{{outlet}}")
});

app.router.addHandlers({
	"application": {
		view: ApplicationView
	},
  "post": {
		enter: function(ctx) {
			var lm = this.lm;
			lm.render("PostLoading", LoadingView, ctx);
			var transition = ctx.transition;
			setTimeout(function() {
				lm.destroyView('PostLoading');
				var view = lm.enter(ctx);
				view.set('context.controller', Controller.create());
				transition.next(ctx);
			}, 500);
		},
    view: PostView,
    controller: Controller
  },
  "post.index": function(ctx) {
		if (ctx.event == "enter") {
			console.log("[enter] post.index");
//      console.log("post.index. render");
//      var lazy_load_class = "var PostIndexView = Ember.View.extend({ " +
//          "template: Ember.Handlebars.compile(\"<a {{action \\\"ok\\\" target=\\\"view\\\"}}>ok</a>\"), " +
//          "actions: { " +
//            "ok: function() { " +
//              "debugger; " +
//            "}" +
//          "}" +
//        "});";
			var route = ctx.transition.getPreviousRoute();
			if (route) {
				ctx.parentViewName = route.name;
			}
      this.lm.render("post.index", PostIndexView, ctx);
			ctx.transition.next(ctx);
    }
    else if (ctx.event == "exit") {
      console.log("[leave] post.index");
			this.lm.destroyView('post.index');
			ctx.transition.next(ctx);
    }
  },
  "post.edit": {
    view: PostEditView,
    controller: null
  }
});

app.router.start();

module.exports = app;
//console.log(app.router.generate("post.edit", { id: 1, ok: 'nice' }));
//app.router.navegate("/posts/12");