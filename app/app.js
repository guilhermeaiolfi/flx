var Ember = require('ember');
var Application = require("flx/Application");
var EmberLayoutManager = require("flx/layout/managers/ember_layout_manager");
var post_edit_tpl = require("app/templates/post/edit.hbs!text");
var post_index_tpl = require("app/templates/post/index.hbs!text");

var app = Application.create({
  rootElement: '.app1',
	lm: new EmberLayoutManager()
});

app.router.map(function(match) {
  match("/posts").to("post",function(match) {
    match("/").to("post.index");
    match("/:id").to("post.edit");
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
    read: function() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      else {
        var i = 0;
        interval = setInterval(function() {
          i = i == 1? 0 : 1;
          var child = sub_views[i].create();
          view.connectOutlet('main', child);
        }, 1000);
      }
    }
  }
});


/**
  use {{action "edit" target="view" to get "from view"}}
**/
var PostView = Ember.View.extend({
  controller: Controller.create(),
  template: Ember.Handlebars.compile("<a {{action \"navegate\"}}>go to test</a><br /><a {{action \"something\"}}>go to something</a><br /><h1 {{action \"read\" target=\"view\"}}>Oba</h1><div class=\"container\">{{outlet}}</div>"),
  actions: {
    read: function() {
      debugger;
      console.log("from view");
    }
  }
});

var PostIndexView = Ember.View.extend({
  template: Ember.Handlebars.compile(post_index_tpl),
  context: {
    name: "Maria",
    mother: {
      name: "Mamãe"
    }
  },
  actions: {
    read: function() {
      debugger;
      console.log("from view");
    }
  },
  didInsertElement: function() {
    //console.log("inserted");
  },
  willDestroyElement: function() {
    //console.log("destroied");
  }
});

var PostEditView = Ember.View.extend({
  template: Ember.Handlebars.compile(post_edit_tpl),
  context: {
    name: "Guilherme",
    params: {
      id: 0
    }
  },
  actions: {
    goAction: function() {
      app.router.navegate(app.router.generate("post.index"));
    }
  }
});

var LoadingView = Ember.View.extend({
	template: function() { return "Loading..."; }
});

app.router.addHandlers({
  "post": {
		enter: function(ctx) {
			var lm = this.lm;
			lm.render("PostLoading", LoadingView, ctx);
			var transition = ctx.transition;
			setTimeout(function() {
				lm.destroyView('PostLoading');
				var view = lm.enter(ctx);
				transition.next(ctx);
			}, 50);
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
//console.log(app.router.generate("post.edit", { id: 1, ok: 'nice' }));
//app.router.navegate("/posts/12");
