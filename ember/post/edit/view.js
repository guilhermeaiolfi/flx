var Ember = require("ember");
var post_edit_tpl = require("app/post/edit/template.hbs!text");
var app = require("app/app");

module.exports = Ember.View.extend({
  template: Ember.Handlebars.compile(post_edit_tpl),
	model: function () {
		return $.ajax("/");
	},
	execute: Ember.on('init', function () {
		var model = this.model();
		var self = this;
		model.then(function(response) {
			self.controller.set("opa", "lorpa");
			self.set('template', Ember.Handlebars.compile("what? {{opa}}"));
			self.rerender();
		});
	}),
  actions: {
    goAction: function() {
			debugger;
      this.router.go(this.router.generate("post.index"));
    }
  }
});