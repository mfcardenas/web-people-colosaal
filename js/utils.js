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
};

$(function () {
    w3IncludeHTML();
    setClassMenu();
})
