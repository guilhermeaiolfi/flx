var Ember = require('ember');
var Application = require("flx/Application");

var app = Application.create({
  rootElement: '.app1'
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
  template: Ember.Handlebars.compile("<a {{action \"read\" target=\"view\"}}>Post</a> Index, {{name}} : {{mother.name}}"),
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
    console.log("inserted");
  },
  willDestroyElement: function() {
    console.log("destroied");
  }
});

var PostEditView = Ember.View.extend({
  template: Ember.Handlebars.compile("[{{params.id}}] View Post, {{name}} <br /> <br /><a {{action \"back\" target=\"view\"}}>go to index</a>"),
  context: {
    name: "Guilherme",
    params: {
      id: 0
    }
  },
  actions: {
    back: function() {
      app.router.navegate('/posts');
    }
  }
});

app.router.addHandlers({
  "post": {
    enter: function(ctx) {
      console.log("post enter");
    },
    render: function(ctx) {
      console.log("post render");
      this.adapter.render("post", PostView, ctx);
    },
    exit: function(ctx) {
      console.log("post exiting");
    },
    view: PostIndexView,
    controller: Controller
  },
  "post.index": function(ctx) {
    if (ctx.event == "render") {
      console.log("post.index. render");
      var lazy_load_class = "var PostIndexView = Ember.View.extend({ " +
          "template: Ember.Handlebars.compile(\"<a {{action \\\"ok\\\" target=\\\"view\\\"}}>ok</a>\"), " +
          "actions: { " +
            "ok: function() { " +
              "debugger; " +
            "}" +
          "}" +
        "});";
      this.adapter.render("post.index", PostIndexView, ctx);
    }
    else if (ctx.event == "render") {
      console.log("leaving post.index");
    }
  },
  "post.edit": {
    enter: function(ctx) {
      ctx.view.set('context.params.id', ctx.route.params.id);
      console.log("post.index. enter");
    },
    render: function(ctx) {
      console.log("post.edit render");
     this.adapter.render("post.edit", PostEditView, ctx);
    },
    exit: function() {
      console.log("post.edit exiting");
    },
    view: PostEditView,
    controller: null
  }
});

app.router.start();
console.log(app.router.generate("post.edit", { id: 1, ok: 'nice' }));
app.router.navegate("/posts/12");
