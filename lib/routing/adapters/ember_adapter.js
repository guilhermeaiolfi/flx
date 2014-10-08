var adapter = function(router) {
  this.router = router;
};

adapter.prototype = {
  connectView: function(parentView, view, options) {
    parentView.connectOutlet(options.into, view);
    view.set('parentView', parentView);
  },
  createView: function(view) {
    return view.create();
  },
  render: function(route_name, child_view, options) {
    var parentView = options.parentView;
    var view = null;
    if (!parentView) {
       view = this.router.lookupActiveView(route_name);
       if (!view) {
        view = this.createView(child_view);
        view.appendTo(this.router.rootElement);
        this.router.registerActiveView(route_name, view);
       }
    }
    else {
      view = this.router.lookupActiveView(route_name);
      if (!view) {
        view = this.createView(child_view);
        this.router.registerActiveView(route_name, view);
      }
      this.connectView(parentView, view, { into: "main" });
    }
  },
  destroyView: function(view, options) {
    var parentView = view.get('parentView');
    if (parentView) {
      var outlet = options.outlet || "main";
      parentView.disconnectOutlet(outlet);
    }
    view.destroy();
  }
};

module.exports = adapter;