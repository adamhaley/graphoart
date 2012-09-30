
(function(old) {
    Backbone.History.prototype.getFragment = function() {
        return old.apply(this, arguments).replace(/\?.*/, '');
    };
})(Backbone.History.prototype.getFragment);

define([], function() {

    var AppRouter = Backbone.Router.extend({
	
    	routes: {

                'home': 'defaultAction'
                , 'info/:which': 'showInfo'
                , 'gallery/:cat': 'showGallery'
                ,'*actions':'defaultAction'

        }
        , initialize: function () {
	
    		 Backbone.history.start();
	
    	}
        , defaultAction: function(){
            console.log('in default action');
            $('.bx-wrapper').hide();
            // $('#carousel').fadeOut(); 
            $('#content nav').html(''); 
          
            $('article').attr('class','home');

            var $carousel = $('<ul />').attr('id','carousel');

            var images = ['http://placekitten.com/g/800/400','http://placekitten.com/800/400'];

            for(i=0;i<images.length;i++){
                var $img = $('<img />').attr('src',images[i]).attr('width','800').attr('height','390');
                var $li = $('<li />').append($img);
                $carousel.append($li);
            }

            $slideshow = $('<div />').attr('id','home-slideshow');

            $slideshow.append($carousel);
    
            $('article').html($slideshow);

            options = {

                mode: 'fade'
                , controls: false
                , auto: true
                , pause: 3000

            }

            $('#home-slideshow').fadeIn();
            $('#carousel').fadeIn().bxSlider(options);
        }
		
        , showInfo: function(which){
           
            $('#content nav').removeClass('contact');

            $('.bx-wrapper').hide();
            $('#content nav').html('');
            $('#gallery').html(''); 
            var navFile = 'templates/nav-' + which + '.tpl';
            var contentFile = 'templates/' + which + '.tpl';

            $('article').attr('class','info');

            $.get(navFile,function(data){
                $('#content nav').html(data);
               
                $('#content nav').addClass(which);
            });

    
            $.get(contentFile,function(data){
              
                $('#content article').html(data);
            });
        }
        , showGallery: function(cat){
            $('#content nav').html('');
            $('article').html('<div id="gallery" />');
            // $('#carousel').fadeOut(function(){
            $('.bx-wrapper').hide();
      
            $('article').attr('class','gallery');

            var loadGallery = function(){
                
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
                            displaySlideQty: 3
                            , moveSlideQty: 1
                            , auto: true
                            , pause: 3000
                        }

                        $('#gallery').html(galleryHtml);
                        $('#loader').show();
                        $('#gallery img:last').load(function(){
                        // console.log('loaded');
                            $('#loader').hide(0,function(){
                                $('.bx-wrapper').show();
                                $('#carousel').fadeIn().bxSlider(options);
                            });
                        });
                
                    }

                });
            }
            loadGallery();
            // setTimeout(loadGallery,1000);   
            
        }
	})
    , router = new AppRouter;

  return router;
});
