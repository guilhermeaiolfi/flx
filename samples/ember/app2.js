var Ember = require('ember');
var Application = require("app/Application");

var app2 = Application.create({
	lm: new LayoutManager({ rootElement: '.app2' })
});

app2.router.map(function(match) {
  match("*:").to("index");
});

var IndexView = Ember.View.extend({
  template: Ember.Handlebars.compile("<a {{action \"ok\" target=\"view\"}}>weee app2</a>"),
  actions: {
    ok: function() {
      debugger;
    }
  }
});

app2.router.addHandlers({
  "index": {
    enter: function(ctx) {
      console.log("post enter from app2");
    },
    render: function(ctx) {
      this.render("index", IndexView, ctx);
    },
    exit: function(ctx) {
      //console.log("post exiting");
    }
  }
});

app2.router.start();