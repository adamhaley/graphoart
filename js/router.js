
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
            $('#carousel').fadeOut(); 
            $('.bx-wrapper').fadeOut();
		}
        , showInfo: function(which){
            console.log('info ' + which);
            $('.bx-wrapper').hide();
            $('#content nav').html('');
             $('#gallery').html(''); 
            var navFile = 'templates/nav-' + which + '.tpl';
        
            $.get(navFile,function(data){
                $('#content nav').html(data);
            });

        }
        , showGallery: function(cat){
             $('#content nav').html('');
           

            
            var loadGallery = function(){
                 $('#carousel').fadeOut(function(){
                $('.bx-wrapper').hide();
                $('#loader').show();
            });
            $.ajax({
                url:'images/gallery/' + cat + '/'
                , error: function(data){
                    console.log(data);
                }
                , success: function(data){
            
                    console.log('ajax call successful');
                    var galleryHtml = '<ul id="carousel">';
                    var images = $(data)[5];

                    $(images).find('a:contains(".jpg")').each(function(){
                        var entry = $(this).text().trim();
                        galleryHtml += '<li><img src="images/gallery/' + cat + '/' + entry + '"" /></li>"';       
                        
                    });

                    galleryHtml += '</ul>';

                    var options = {
                         /*ticker: true
                        , tickerSpeed: 7500
                        ,
                        */ displaySlideQty: 3
                        , moveSlideQty: 2
                        , auto: true
                        , pause: 3000
                    }

                    $('#gallery').html(galleryHtml);
                    
                    $('#gallery img:last').load(function(){
                        // console.log('loaded');
                        $('#loader').hide(function(){
                            $('.bx-wrapper').show();
                            $('#carousel').fadeIn().bxSlider(options);
                        });

                        
                        
                         
                    });
                
                }

                });
            }
     
             setTimeout(loadGallery,1000);
            
        }
	})
    , router = new AppRouter;

  return router;
});
