#About (WIP)

### NOTE: Do not use it! At least not just yet

This is a proof of concept trying to create a router that could be more flexible than the ones available.

Goals:

  * Lazy loading of routes and handlers
  * Framework agnostic
  * Full Control of the transition execution. Being able to go forward, rewind, reload, and go backwards
  * Be lightweight

It has the concept of layout managers to deal with how views are render and connect with each other. So we could have a React Layout Manager, Ember Layout Manager, Ractive Layout Manager, and so on.

That way we can keep most of the code if we decided to change the view layer afterwards.

Currently there is managers for:

  * EmberJS (~200 LOC)
  * RactiveJS (~60 LOC)

It uses [router-recognizer](https://github.com/tildeio/route-recognizer) under the hood.

# Usage

Although layout managers do the heavy lifting for you. If you're not satisfied how it's being done, you can easily implement your on or implement hooks like ```enter```, ```exit``` in your route handlers:

```javascript
  router.addHandlers({
    "post": {
      enter: function(ctx) {
         this.lm.render("post", MyViewClass, ctx);
         ctx.transition.next(ctx); // see that we could use promises
                                   // or callbacks and continue async
      }
   }
```

# Help

If you like the idea and was looking for something like this. Please help, the code is very slim and easy to follow.

# Note

It's a work in progress and there is no guarantee of maintenance of any kind. Use it at your own risk. The project doesn't even have a name. Any feedback/suggestion appreciated.

#Tests

It uses testem and QUnit for tests. THE TESTS DOESN'T COVER MUCH YET. To run them, invoke:
```
testem
```
