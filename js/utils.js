/**
 * Created by mcardenas on 24/10/16.
 */
/* set active class for page
 =============================================*/
function setClassMenu() {
    var class_ = $("#header-include").attr('class');
    if (class_ == 'index'){
        $("#index").addClass("active");
    }
    if (class_ == 'about'){
        $("#about").addClass("active");
    }
    if (class_ == 'proyectos'){
        $("#proyectos").addClass("active");
    }
    if (class_ == 'simulaciones'){
        $("#simulaciones").addClass("active");
    }
    if (class_ == 'tecnologia'){
        $("#tecnologia").addClass("active");
    }
    if (class_ == 'licencia'){
        $("#licencia").addClass("active");
    }
    if (class_ == 'contactanos'){
        $("#contactanos").addClass("active");
    }
}

$(function () {
    w3IncludeHTML();
    setClassMenu();

    /*$('.micarrousel').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:true,
        arrows: true,
        centerMode:true,
        dots: true,
        infinite: true,
        centerPadding:'40%',
        adaptiveHeight: true,
        variableWidth:true,
        accesibility:true
    });*/
});

$(function() {
    var showcase = $("#showcase");

    showcase.Cloud9Carousel( {
        yOrigin: 42,
        yRadius: 30,
        itemClass: "card",
        buttonLeft: $(".nav_card.left_card"),
        buttonRight: $(".nav_card.right_card"),
        bringToFront: true,
        onLoaded: function() {
            showcase.css( 'visibility', 'visible' );
            showcase.css( 'display', 'none' );
            showcase.fadeIn( 1500 )
        }
    });

    // Simulate physical button click effect
    $('.nav_card').click( function( e ) {
        var b = $(e.target).addClass( 'down' );
        setTimeout( function() { b.removeClass( 'down' ) }, 80 )
    });

    $(document).keydown( function( e ) {
        switch( e.keyCode ) {
            /* left arrow */
            case 37:
                $('.nav_card.left_card').click();
                break;

            /* right arrow */
            case 39:
                $('.nav_card.right_card').click()
        }
    } )
});
