
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
                , 'info/:which': 'showInfo'
                , 'gallery/:cat': 'showGallery'

        }
        , initialize: function () {
	
    		 Backbone.history.start();
	
    	}
		, defaultAction: function( actions ){
            $('#content nav').html('');
		}
        , showInfo: function(which){
            console.log('info ' + which);

            var navFile = 'templates/nav-' + which + '.tpl';
            $.get(navFile,function(data){
                $('#content nav').html(data);
            });

        }
        , showGallery: function(cat){
             $('#content nav').html('');
            console.log('gallery ' + cat)

        }
	})
    , router = new AppRouter;

  return router;
});
