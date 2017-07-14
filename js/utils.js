/*
*
*/
$(function () {
    w3IncludeHTML();
});

$(function() {
    var showcase = $("#showcase");

    if (showcase != undefined) {
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
    }

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

/**
 * Set language for web site.
 * @returns {*}
 */
function get_language() {
    var lang = $.jStorage.get("language");
    if (lang == '' || lang == 'undefined' || lang == null) {
        lang = (navigator.language.split("-")[0] != undefined)? navigator.language.split("-")[0]: "es";
    }
    return lang;
}

function set_language(lang){
    $.jStorage.set("language", lang);
}

$(document).ready(function() {
    //lang_nav_ = (navigator.language.split("-")[0] != undefined)? navigator.language.split("-")[0]: "es";
    i18n.init(function(t) {
        traslateLang(get_language());
    });
});

function traslateLang(lang){
    i18n.init(function(t) {
        (lang == 'es') ? idioma = 'es': idioma = 'en';
        set_language(lang);

        var brand = $("#brand");
        if (brand != undefined){
            brand.i18n({lng: idioma});
        }
        var menu = $("#menu");
        if (menu != undefined) {
            menu.i18n({lng: idioma});
        }
        var home = $("#home");
        if (home != undefined) {
            home.i18n({lng: idioma});
        }
        var footer = $("#footer");
        if (footer != undefined){
            footer.i18n({lng: idioma});
        }
        var about = $("#about");
        if (about != undefined) {
            about.i18n({lng: idioma});
        }
        var casep = $("#casep");
        if (casep != undefined){
            casep.i18n({lng: idioma});
        }
    });
}