// Set all carousel items to the same height
    function carouselNormalization() {
        
        window.heights = [], //create empty array to store height values
        window.tallest; //create variable to make note of the tallest slide
        
        function normalizeHeights() {
            jQuery('.carousel-products .carousel-inner .carousel-item').each(function() { //add heights to array
                window.heights.push(jQuery(this).outerHeight());
            });
            window.tallest = Math.max.apply(null, window.heights); //cache largest value
            jQuery('.carousel-products .carousel-inner .carousel-item').each(function() {
                jQuery(this).css('min-height',tallest + 'px');
            });
        }
        normalizeHeights();

        jQuery(window).on('resize orientationchange', function () {
            
            window.tallest = 0, window.heights.length = 0; //reset vars
            jQuery('.carousel-products .carousel-inner .carousel-item').each(function() {
                jQuery(this).css('min-height','0'); //reset min-height
            }); 
            
            normalizeHeights(); //run it again 

        });
        
    }
    
    jQuery( document ).ready(function() {
        carouselNormalization();
    });
