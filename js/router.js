
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
            $('a').removeClass('active');

            $('a[href$="home"]').addClass('active');

             $('#content article').css('overflow','none');


            console.log('in default action');
            $('.bx-wrapper').hide();
            // $('#carousel').fadeOut(); 
            $('#content nav').html(''); 
          
            $('article').attr('class','home');

            var $carousel = $('<ul />').attr('id','carousel');



            $.ajax({
                    url:'images/home-slideshow/'
                    , error: function(data){
                        console.log(data);
                    }
                    , success: function(data){
                        var imageArray = $(data)[5];
                        $(imageArray).find('a:contains(".jpg")').each(function(){
                            var $img = $('<img />').attr('src','images/home-slideshow/' + $(this).text().trim()).attr('width','800').attr('height','390');
                            var $li = $('<li />').append($img);
                            $carousel.append($li);

                        });
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
                        $carousel.fadeIn().bxSlider(options);
                    }
            });


            /*
            var images = ['http://placekitten.com/g/800/400','http://placekitten.com/800/400'];

            for(i=0;i<images.length;i++){
                var $img = $('<img />').attr('src',images[i]).attr('width','800').attr('height','390');
                var $li = $('<li />').append($img);
                $carousel.append($li);
            }
            */
          
        }
		
        , showInfo: function(which){

            
            $('a').removeClass('active');
            $('a[href$="' + which + '"]').addClass('active');

            $('#content nav').removeClass('contact');

            $('.bx-wrapper').hide();
            $('#content nav').html('');
            $('#content article').css('overflow','auto');


            $('#gallery').html(''); 
            var navFile = 'templates/nav-' + which + '.tpl';
            var contentFile = 'templates/' + which + '.tpl';

            $('article').attr('class','info');

            $.get(navFile,function(data){
                $('#content nav').html(data);
               
                $('#content nav').addClass(which);

                $('#content article').scrollTop(0);
                //CRAZINESS IN HERE. CLEAN THIS UP!!!!
                $.get(contentFile,function(data){
              
                    $('#content article').html(data);


                    if(which=='rates'){

                        var positions = {};

                        $('#content nav a').each(function(){
                            var id = $(this).text().toLowerCase();
                            var scrollPos = $('#' + id).position().top;
                            positions[id] = scrollPos;  
                        });

                        //remove any click events which may already be attached
                        $('#content').unbind('click');

                        //add the click event delegating nav links
                        $('#content').on('click','nav.rates a',function(){
                   
                            var id = $(this).text().toLowerCase();
                            var scrollPos = positions[id];

                            $('#content article').animate({scrollTop: scrollPos},'slow');    
                        });
                    }else if(which=='about'){
                      


                        var positions = {};
                        $('#content nav a').each(function(){
                       
                            var id = $(this).attr('id').replace('nav-','');
                            var scrollPos = $('#' + id).position().top;
                            console.log(scrollPos);

                            positions[id] = scrollPos;  
                        });

                         //remove any click events which may already be attached
                        $('#content').unbind('click');

                        //add the click event delegating nav links
                        $('#content').on('click','nav.about a',function(){
                           

                            var id = $(this).attr('id').replace('nav-','');
                            var scrollPos = positions[id];
                            console.log(scrollPos);

                            $('#content article').animate({scrollTop: scrollPos},'slow');    
                        });
                    }
                });

            });

            // options = {scrollbarClass: 'myScrollbar'};
            


           

        }
        , showGallery: function(cat){
            $('a').removeClass('active');
            $('a[href$="' + cat + '"]').addClass('active');

            $('#content article').css('overflow','none');


            var graphicCats = ['retouches','editorial','corporate','logo','media','webdesign'];
            if($.inArray(cat,graphicCats) > -1){
                $('a[href$="graphic-design"]').addClass('active');
            }else{
                $('a[href$="photography"]').addClass('active');
            }

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
                            galleryHtml += '<li><img src="images/gallery/' + cat + '/' + entry + '" /></li>';       
                        
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
                                $('#carousel').fadeIn();
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
