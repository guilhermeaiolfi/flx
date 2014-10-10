var Ember = require("ember");
var post_edit_tpl = require("app/post/edit/template.hbs!text");
var app = require("app/app");

module.exports = Ember.View.extend({
  template: Ember.Handlebars.compile(post_edit_tpl),
  context: {
    name: "Guilherme",
    params: {
      id: 0
    }
  },
  actions: {
    goAction: function() {
      app.router.go(app.router.generate("post.index"));
    }
  }
});