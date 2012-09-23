requirejs.config({

    // Defines the base URL for Javascript files
    // The URL is relative to the main index.html page
    baseUrl: 'js/'

    // Defines aliases for common Javascript files/modules
    , paths: {
		'jquery': 'libs/jquery/jquery.min'
		,'underscore': 'libs/underscore/underscore'
		,'backbone': 'libs/backbone/backbone'
		,'mustache': 'libs/mustache/mustache'
		,'templates': '../templates'
		,'boxslider': 'libs/jquery/boxslider/jquery.bxSlider.min' 
	}
	
	, shim: {
		'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
		, 'router': ['backbone', 'underscore', 'mustache' , 'boxslider']
		, 'boxslider': ['jquery']
	}

});

// Activates router module
require(['router'], function() { });
