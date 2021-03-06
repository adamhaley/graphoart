
(function(old) {
    Backbone.History.prototype.getFragment = function() {
        return old.apply(this, arguments).replace(/\?.*/, '');
    };
})(Backbone.History.prototype.getFragment);

define([], function() {

    var AppRouter = Backbone.Router.extend({
	
    	routes: {

                'home': 'defaultAction'
                , 'info/:which': 'transitionShowInfo'
                , 'gallery/:cat': 'showGallery' 
                , 'login': 'clientLogin'
                ,'*actions':'defaultAction'
        }
        , initialize: function () {
	    	Backbone.history.start();

            //current date in footer
            var year = new Date().getFullYear();
            $('footer').find('.current-year').text(year);

            $('body').on('click', '#prev',this.backGallery);
            $('body').on('click', '#next',this.forwardGallery);
            //submit event handler
            $('body').on('click','#submit',function(e){
                e.preventDefault();

                var url = '/mail.php?' + $('#email-form').serialize();
         

                $.ajax({
                    url: url,
                    success: function(data){

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
	, transitionShowInfo: function(which){
            $('#content').addClass('hidden');
            var _this = this;
            var showThisInfo = function(){
                _this.showInfo(which);
            }

            setTimeout(showThisInfo, 600);
        }
        , showInfo: function(which){
            
            this.animationSequence();
             
                $('a').removeClass('active');
                $('.gallery-control').hide();
                $('a[href$="' + which + '"]').addClass('active');

                $('#content nav').removeClass('contact');

                $('.bx-wrapper').hide();
                $('#content nav').html('');
                
                $('#content article').removeClass('gallery');
                $('#content article').addClass('info');

                $('#gallery').html(''); 
                var navFile = 'templates/nav-' + which + '.tpl';
                var contentFile = 'templates/' + which + '.tpl';

                $('article').attr('class','info');

                $.get(navFile,function(data){
                    $('#content nav').html(data);
                   
                    $('#content nav').addClass(which);

                    $('#content article').scrollTop(0);
                    
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
                                

                                positions[id] = scrollPos;  
                            });

                             //remove any click events which may already be attached
                            $('#content').unbind('click');

                            //add the click event delegating nav links
                            $('#content').on('click','nav.about a',function(){
                               

                                var id = $(this).attr('id').replace('nav-','');
                                var scrollPos = positions[id];
                               

                                $('#content article').animate({scrollTop: scrollPos},'slow');    
                            });
                        }

                    });
                });

    
            $('#content').removeClass('hidden');
        }
        , showGallery: function(cat){
            $('a').removeClass('active');
            $('a[href$="' + cat + '"]').addClass('active');

              $('#content article').removeClass('info');
            $('#content article').addClass('gallery');

            var graphicCats = ['retouches','editorial','corporate','logo','media','webdesign'];
            if($.inArray(cat,graphicCats) > -1){
                $('a[href$="graphic-design"]').addClass('active');
            }else{
                $('a[href$="photography"]').addClass('active');
            }

            var _this = this;

            $('#content nav').html('');

            $.get('templates/gallery.tpl',function(tpl){
                $('article').html(tpl);
                $('.bx-wrapper').hide();
      
                $('article').attr('class','gallery');

                _this.animationSequence();
                $('.gallery-control').show();
                /*uncomment to activate auto gallery cycle
                **  
                var forwardGallery = function(){
                    _this.forwardGallery();
                }
                if(_this.intervalId){
                    clearInterval(_this.intervalId);
                }
                _this.intervalId = setInterval(forwardGallery,5000);
                */
                loadGallery();
                
            });
            
            function loadGallery(){
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
                                $('#imgcount').html(ct);
                                ct++;
                            });
                        });

                        $('#gallery img:eq(5)').load(function(){
               
                            $('#loader').hide(0,function(){
                                $('.bx-wrapper').show();
                                $('#gallery').fadeIn();
                                $('#imgcount').html(0);
                            });
                        });
                
                    }

                });
            }
          
        }
        , forwardGallery: function(){
            var list = $('#gallery ul');
            var newPos = -$('li',list).first().next().position().left;
            list.animate({left:newPos},200,function(){
                    $('li',list).first().appendTo(list);
                    list.css({left:0});
            });
        }
        , backGallery: function(){
            var list = $('#gallery ul');
            $('li',list).last().prependTo(list);

            var newPos = -$('li',list).first().next().position().left;
            list.css({left:newPos});
            list.animate({left:0},200);
        }
        , clientLogin: function(){
              this.animationSequence();
            $('article').html('<div id="login">Client login Coming soon...</div>');
            
        }
	})
    , router = new AppRouter;

  return router;
});
