
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

            $('#content nav').html('');

            var navFile = 'templates/nav-' + which + '.tpl';
        
            $.get(navFile,function(data){
                $('#content nav').html(data);
            });

        }
        , showGallery: function(cat){
             $('#content nav').html('');
            // console.log('gallery ' + cat);

            $.ajax({
                url:'/graphoart/images/gallery/' + cat + '/'
                , error: function(data){
                    console.log(data);
                }
                , success: function(data){
                    
                    $('#gallery').html(''); 

                    var galleryHtml = '<ul id="carousel">';
                    var images = $(data)[5];

                    $(images).find('a').each(function(){
                        var entry = $(this).text().trim();
                        if(entry != 'Parent Directory'){    
                            galleryHtml += '<li><img src="images/gallery/' + cat + '/' + entry + '"" /></li>"';       
                        }
                        
                    });

                    galleryHtml += '</ul>';

                    $('#gallery').html(galleryHtml); 
                    $('#carousel').bxSlider();
                }

            });
        }
	})
    , router = new AppRouter;

  return router;
});
