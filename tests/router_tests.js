var Ember = require('ember');
var Application = require("flx/Application");
var EmberLayoutManager = require("flx/layout/managers/ember_layout_manager");
var post_edit_tpl = require("app/templates/post/edit.hbs!text");
var post_index_tpl = require("app/templates/post/index.hbs!text");

var app = null;
QUnit.module("Router", {
  setup: function() {
		app = Application.create({
			lm: new EmberLayoutManager({ rootElement: '.app1' })
		});
  },

  teardown: function() {
		app.router.location.setURL("/");
		app.router._currentTransition = null;
		app.destroy();
  }
});

test('test simple transition', function() {
	app.router.map(function(match) {
		match("/posts").to("post",function(match) {
			match("/").to("post.index");
			match("/:id").to("post.edit");
		});
	});
	app.router.addHandlers({
		"post": Ember.K,
		"post.index": Ember.K
	});

	var transition = app.router.createTransition("/posts");
	equal(transition.routes[0].name, "post", "First transition should be post");
	equal(transition.routes[1].name, "post.index", "Second transition should be post.index");
});

test('test URL generation', function() {
	app.router.map(function(match) {
		match("/posts").to("post",function(match) {
			match("/").to("post.index");
			match("/:id").to("post.edit");
		});
	});

	app.router.addHandlers({
		"post": Ember.K,
		"post.index": Ember.K
	});

	equal(app.router.generate("post.index"), "/posts", "Generated the correct URL for post.index");
	equal(app.router.generate("post.edit", { id: 1 }), "/posts/1", "Generated the correct URL for route with params");
	equal(app.router.generate("post.edit", { id: 1, query: 'value' }), "/posts/1?query=value", "Generated the correct URL for route with query params");
});

test('test go method', function() {
	app.router.map(function(match) {
		match("/first").to("first",function(match) {
			match("/").to("first.index");
			match("/:param").to("first.edit");
		});
	});

	app.router.addHandlers({
		"first": Ember.K,
		"first.index": Ember.K,
		"first.edit": Ember.K
	});
	var urls = ['/first', '/first/', '/first/10', '/first/1'];

	for (var i = 0; i < urls.length; i++) {
		app.router.go(urls[i]);
		equal(app.router.location.getURL(), urls[i], "Correnct url after navegation");
	}
});

test('test calls to handlers', function() {
	app.router.map(function(match) {
		match("/").to("index");
		match("/first").to("first",function(match) {
			match("/").to("first.index");
			match("/:param").to("first.edit");
		});
	});

	var counters = { index_count: 0, first_count: 0, first_index_count: 0, first_edit_count: 0 };

	function zero_counters() {
		app.router.go("/");
		app.router._currentTransition = null;
		counters['index_count'] = counters['first_count'] = counters['first_index_count'] = counters['first_edit_count'] = 0;
	}

	app.router.addHandlers({
		"index": function(ctx) { counters['index_count']++; ctx.transition.next(ctx); },
		"first": function(ctx) { counters['first_count']++; ctx.transition.next(ctx); },
		"first.index": function(ctx) { counters['first_index_count']++; ctx.transition.next(ctx) ;},
		"first.edit": function(ctx) { counters['first_edit_count']++; ctx.transition.next(ctx); }
	});

	zero_counters();
	app.router.go("/first");
	deepEqual(counters, { index_count: 0, first_count: 1, first_index_count: 1, first_edit_count: 0 }, "First handler was called");

	zero_counters();
	app.router.go("/first/1");
	deepEqual(counters, { index_count: 0, first_count: 1, first_index_count: 0, first_edit_count: 1 }, "First handler was called");

});