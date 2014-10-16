var Ember = require("ember");
var template = require("samples/ember/post/edit/template.hbs!text");
var app = require("samples/ember/app");
var SuperDummyComponent = require("samples/ember/components/SuperDummyComponent");

app.container.register('component:super-dummy', SuperDummyComponent);
module.exports = Ember.View.extend({
  template: Ember.Handlebars.compile(template),
	model: function () {
		return $.ajax("/");
	},
	execute: Ember.on('init', function () {
		var model = this.model();
		var self = this;
		model.then(function(response) {
			// self.controller.set("opa", "lorpa");
			// self.set('template', Ember.Handlebars.compile("what? {{opa}}"));
			// self.rerender();
		});
	}),
  actions: {
    goAction: function() {
			debugger;
      this.router.go(this.router.generate("post.index"));
    }
  }
});