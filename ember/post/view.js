var Ember = require("ember");
var template = require("app/post/template.hbs!text");
var app = require("app/app");

/**
  use {{action "edit" target="view" to get "from view"}}
**/

module.exports =  Ember.View.extend({
  //controller: Controller.create(),
  template: Ember.Handlebars.compile(template),
  actions: {
    read: function() {
      debugger;
      console.log("from view");
    }
  }
});
