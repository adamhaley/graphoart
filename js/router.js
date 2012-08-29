
(function(old) {
    Backbone.History.prototype.getFragment = function() {
        return old.apply(this, arguments).replace(/\?.*/, '');
    };
})(Backbone.History.prototype.getFragment);

define([], function() {

    var AppRouter = Backbone.Router.extend({
	
    	routes: {

                'home': 'defaultAction'
         //       , 'tests': 'runTests'
                , 'info/:file': 'showInfo'
                , 'gallery/:cat': 'showGallery'

        }
        , initialize: function () {
	
    		 Backbone.history.start();
	
    	}
		, defaultAction: function( actions ){
            console.log('home');
		}
        , showInfo: function(file){
            console.log('info ' + file);
        }
        , showGallery: function(cat){
            console.log('gallery ' + cat)

        }
	})
    , router = new AppRouter;

  return router;
});
