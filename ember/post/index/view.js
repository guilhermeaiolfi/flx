var Ember = require("ember");
var post_index_tpl = require("app/post/index/template.hbs!text");
var app = require("app/app");

module.exports = Ember.View.extend({
  template: Ember.Handlebars.compile(post_index_tpl),
  actions: {
    read: function() {
      console.log("from view");
    }
  },
	_init: function() {
		var names = [{ name: 'Guilherme Aiolfi' }, { name: 'John Snow' }];
		var controller = this.get('controller');
		controller.set('items', names);
	}.on('init'),
  didInsertElement: function() {
    //console.log("inserted");
  },
  willDestroyElement: function() {
    //console.log("destroied");
  }
});