(function($, viewport) {
    'use strict';

    var animationDuration = 200;


    function isMobileMenu() {
        return viewport.is('<md');
    }


    if ($('.header-navbar .nav > .dropdown').length) {
        // Trigger dropdown menu on hover
        $('.header-navbar .nav > .dropdown').on('mouseenter mouseleave', function(event) {
            if (isMobileMenu()) return;

            var $this = $(this);

            if ((event.type == 'mouseenter' && !$this.is('.open')) ||
                (event.type == 'mouseleave' && $this.is('.open'))) {
                $this.find('.dropdown-toggle').trigger('click');
            }
        });

        // Override dropdown animations
        $('.header-navbar .nav > .dropdown').on('show.bs.dropdown hide.bs.dropdown', function(event) {
            var dropdownMenu = $(this).find('.dropdown-menu').first().stop(true, true);

            if (isMobileMenu()) {
                if (event.type == 'show') {
                    dropdownMenu.slideDown(animationDuration);
                } else {
                    dropdownMenu.slideUp(animationDuration);
                }
            } else {
                if (event.type == 'show') {
                    dropdownMenu.fadeIn(animationDuration);
                } else {
                    dropdownMenu.fadeOut(animationDuration);
                }
            }
        });
    }

    // Home page header slider
    if ($('#header-slider').length && jQuery().revolution) {
        $('#header-slider').show().revolution({
            sliderType: 'standard',
            responsiveLevels: [1500, 1200, 970, 750],
            gridwidth: [1170, 970, 750, 480],
            gridheight: 560,
            autoHeight: 'off',
            delay: 9000,
            lazyType: 'all',
            dottedOverlay: 'on',
            spinner: 'spinner2',
            debugMode: false,
            navigation: {
                onHoverStop: 'off',
            },
        });
    }

    // Home page "Our services" & "Shop" carousels
    if ($('.services-carousel, .shop-carousel--home').length) {
        $('.services-carousel, .shop-carousel--home').owlCarousel({
            items: 1,
            stagePadding: 15,
            margin: 30,
            loop: true,
            responsive: {
                768: {
                    items: 2,
                },
                992: {
                    items: 3,
                },
                1200: {
                    items: 4,
                }
            }
        });
    }

    // Home page "Reviews" carousel
    if ($('.reviews-carousel').length) {
        $('.reviews-carousel').owlCarousel({
            items: 1,
            stagePadding: 15,
            margin: 30,
            loop: true,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 7000,
            autoplayHoverPause: true,
            autoplaySpeed: 800,
        });
    }

    // Shop page products carousels
    if ($('.shop-carousel').length) {
        $('.shop-carousel').owlCarousel({
            items: 1,
            margin: 30,
            stagePadding: 15,
            loop: true,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 7000,
            autoplayHoverPause: true,
            autoplaySpeed: 800,
            responsive: {
                768: {
                    items: 2,
                    dots: true,
                },
                897: {
                    items: 3,
                },
                1025: {
                    items: 4,
                },
                1201: {
                    items: 5,
                }
            },
        });
    }
}(jQuery, ResponsiveBootstrapToolkit));


// Initialize Google Maps
function initMap() {
    'use strict';

    // Set your location here:
    var location = {
        lat: -37.8325257,
        lng: 144.946047
    };

    var map = new google.maps.Map($('#map')[0], {
        center: location,
        zoom: 14,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
    });

    new google.maps.Marker({
        position: location,
        map: map,
    });
}