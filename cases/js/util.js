/**
 * Created by mcardenas on 16/10/16.
 */

$(function () {
    //Tipped.create('.tooltip_', {skin: 'gray', position: 'rightmiddle'});

    $('.agile-bottom-grid').draggable({
        opacity: 0.35,
        zIndex: 1
    });

    $('.agile-Updating-grids').draggable({
        opacity: 0.35,
        zIndex: 1
    });

    $('.area-grids').draggable({
        opacity: 0.35,
        zIndex: 1
    });
});

$(function () {
    var characterReg = /[`~!@#$%^&*()_°¬|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    $('#bottom_text_tag_1').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
    $('#bottom_text_tag_2').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
    $('#bottom_text_tag_3').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
    $('#bottom_text_tag_4').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
    $('#text_tag_1').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
    $('#text_tag_2').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
    $('#text_tag_3').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
    $('#text_tag_4').bind("keydown", function(event){
        var inputVal = $(this).val();
        if(characterReg.test(inputVal)) {
            $(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
        }
    });
});

/**
 * Function isNumeric for validate input field numeric.
 * @param elem
 * @param helperMsg
 * @returns {boolean}
 */
function isNumeric(elem, helperMsg){
    var numericExpression = /^[0-9]+$/;
    if(elem.value.match(numericExpression)){
        return true;
    }else{
        alert(helperMsg);
        elem.focus();
        return false;
    }
}

/**
 * Function Style Title CP.
 */
function getStyleDescription(){
    var style = {
        "1": "panel panel-default",
        "2": "panel panel-primary",
        "3": "panel panel-success",
        "4": "panel panel-info",
        "5": "panel panel-warning",
        "6": "panel panel-danger"
    };
    var key = Math.floor((Math.random() * 6) + 1);
    var ele = $("#cam-title");
    ele.removeClass();
    ele.addClass(style[key]);
}
getStyleDescription();