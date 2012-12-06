var App = {

    module: function () {
		var modules = {};

	    return function(name) {

	        if (modules[name]) {
	            return modules[name];
	        }
	        return modules[name] = { Views: { } };
	    };
	}()
}

App.vent = _.extend({ }, Backbone.Events);

/* Namespaces */
/* Module loader memoization */