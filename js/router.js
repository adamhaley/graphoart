
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
             $('#gallery').fadeOut(); 
		}
        , showInfo: function(which){
            console.log('info ' + which);

            $('#content nav').html('');
             $('#gallery').html(''); 
            var navFile = 'templates/nav-' + which + '.tpl';
        
            $.get(navFile,function(data){
                $('#content nav').html(data);
            });

        }
        , showGallery: function(cat){
             $('#content nav').html('');
            // console.log('gallery ' + cat);
            var loadGallery = function(){
                if(!$('#gallery').is(':visible')){
                    $('#gallery').fadeIn();
                }

                $.ajax({
                url:'/graphoart/images/gallery/' + cat + '/'
                , error: function(data){
                    console.log(data);
                }
                , success: function(data){
            
                    console.log('ajax call successful');
                    var galleryHtml = '<ul id="carousel">';
                    var images = $(data)[5];

                    $(images).find('a').each(function(){
                        var entry = $(this).text().trim();
                        if(entry != 'Parent Directory'){    
                            galleryHtml += '<li><img src="images/gallery/' + cat + '/' + entry + '"" /></li>"';       
                        }
                    });

                    galleryHtml += '</ul>';

                    var options = {
                        // ticker: true
                        // , tickerSpeed: 1050
                        displaySlideQty: 3
                        , moveSlideQty: 2
                        , auto: true
                    }

                    //figure out effects queue here
                    // $('#gallery').fadeOut().html(galleryHtml).fadeIn();
                    $('#gallery').html(galleryHtml);
                    $('#carousel').bxSlider(options);
                    // $('#gallery').show(200);
                    console.log('done');
                }

                });

            };

            // $('#gallery').fadeOut(200, function(){loadGallery();});
            loadGallery()
            
        }
	})
    , router = new AppRouter;

  return router;
});
