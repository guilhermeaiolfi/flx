var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
	execute: Ember.on('init', function() {
		var params = this.get('params');
	})
});