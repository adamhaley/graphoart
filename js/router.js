
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
                , 'login': 'clientLogin'
                ,'*actions':'defaultAction'

        }
        , initialize: function () {
	    	Backbone.history.start();

            //submit event handler
            $('body').on('click','#submit',function(e){
                e.preventDefault();

                var url = '/mail.php?' + $('#email-form').serialize();
         
                console.log(url);

                $.ajax({
                    url: url,
                    success: function(data){
                        console.log(data);
                        $('article').html('<div id="login">Thank You, Your message has been sent!</div>');
                    }
                });
            });
	    }
        , preloadImages: function(){
            //preloads all images from all galleries on the site
            $.ajax({
                    url:'list-images.php'
                    , data: 'dir=images/gallery/'
                    , dataType: 'text json'
                    , success: function(data){
                        $.each(data.files,function(){
                            var cat = this.valueOf();
                            $.ajax({
                                url: 'list-images.php'
                                , data: 'dir=images/gallery/' + cat
                                , dataTyle: 'text json'
                                , success: function(data){
                                    $.each(data.files,function(){
                                       var img = this.valueOf();
                                       var imgUrl = 'images/gallery/' + cat + '/' + img;
                                       console.log(imgUrl);
                                       (new Image()).src = imgUrl;
                                    });
                                }

                            });
                        });
                    }
            });            
        }
        , animationSequence: function (){
            $('#pre-loader').hide();

            $('#watermark').addClass('hidden');

            var showContent = function(){
                $('#content').removeClass('hidden');
            }
                            
            var showHeader = function(){
                $('header').removeClass('hidden');
            }

            var showFooter = function(){
                $('footer').removeClass('hidden');
            }

            var showNav = function(){
                $('nav').removeClass('hidden');
            }

            setTimeout(showContent,300);
            setTimeout(showNav, 1000);
            setTimeout(showHeader,700);
            setTimeout(showFooter,700);
            // this.preloadImages();
        }
        , defaultAction: function(){
           
           $('<img/>',{
                'src': 'images/logo.png',
                'load': function(){
                    $('#watermark').removeClass('homeHidden');
                }
            });
            
            $('#loader').hide();

            $('a').removeClass('active');

            $('a[href$="home"]').addClass('active');

            $('#content article').css('overflow','none');

            $('.bx-wrapper').hide();
           
            $('#content nav').html(''); 
          
            $('article').attr('class','home');

            var $carousel = $('<ul />').attr('id','carousel');
            var router = this;

            $.ajax({
                    url:'list-images.php'
                    , data: 'dir=images/home-slideshow/'
                    , dataType: 'text json'
                    , error: function(xhr,error){
                        
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
                        console.log(xhr.status);
                        console.log(error);

                    }
                    , success: function(data){
                        console.log('success');
                        // console.log(data.files);
                       
                        $.each(data.files,function(){
                            
                            var $img = $('<img />').attr('src','images/home-slideshow/' + this.trim()).attr('width','800').attr('height','390');
                    
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

                        $('#carousel img:first').load(function(){
                            //opening animation sequence
                            router.animationSequence();
                            

                        });

                        $('#home-slideshow').fadeIn();
                        $carousel.fadeIn().bxSlider(options);
                    }
            });
          
        }
		
        , showInfo: function(which){
            if(which == 'photography'){
                window.location.hash = "/gallery/headshots"
            }else if(which == 'graphic-design'){
                window.location.hash = "/gallery/retouches"

            }
            
            this.animationSequence();

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


            this.animationSequence();

            var loadGallery = function(){
                $('#gallery').hide();
                $('#imgcount').html(0);
                $.ajax({
                    url:'list-images.php'
                    , data: 'dir=images/gallery/'  + cat + '/'
                    , dataType: 'text json'
                    , error: function(xhr,error){
                        
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
                        console.log(xhr.status);
                        console.log(error);

                    }
                    , success: function(data){
                        console.log('success');
                        // console.log(data.files);
                       
                        var galleryHtml = '<ul>';
                        $.each(data.files,function(){
                            
                             galleryHtml += '<li><img src="images/gallery/' + cat + '/' + this + '" /></li>';     

                        });

                        galleryHtml += '</ul>';

                        var options = {
                            displaySlideQty: 3
                            , moveSlideQty: 1
                            , auto: true
                            , pause: 3000
                        }

                        $('#gallery').html(galleryHtml);
                        $('#loader').show().find('#imgcount').html('0');

                        $('#imgtotal').html($('#gallery img').length);

                        var ct = 1;
                        $('#gallery img').each(function(i){
                            
                            $(this).load(function(){
                                console.log(ct);
                                $('#imgcount').html(ct);
                                ct++;
                            });
                        });

                        $('#gallery img:last').load(function(){
               
                            $('#loader').hide(0,function(){
                                $('.bx-wrapper').show();
                                $('#gallery').fadeIn();
                                $('#imgcount').html(0);
                            });
                        });
                
                    }

                });
            }
            loadGallery();
        }
        ,clientLogin: function(){
            console.log('login');

              this.animationSequence();
            $('article').html('<div id="login">Client login Coming soon...</div>');
            // $('#content').html();
        }
	})
    , router = new AppRouter;

  return router;
});
