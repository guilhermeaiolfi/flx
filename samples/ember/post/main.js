var app = require("samples/ember/app");
var PostView = require("samples/ember/post/view");
var PostEditView = require("samples/ember/post/edit/view");
var PostIndexView = require("samples/ember/post/index/view");

app.router.map(function(match) {
  match("/").to("application", function(match) {
    match("/post").to("post",function(match) {
      match("/").to("post.index");
      match("/:id").to("post.edit");
    });
  });
});

app.router.addHandlers({
  "post": {
    view: PostView
  },
  "post.index": {
    // enter: function(ctx) {
    //   debugger;
    //   ctx.transition.next(ctx);
    // },
    view: PostIndexView
  },
  "post.edit": {
    view: PostEditView
  }
});