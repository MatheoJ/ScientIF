var showChar = 500;  // How many characters are shown by default
var ellipsestext = "...";
var moretext = "Voir plus >";
var lesstext = "Voir moins";

/**
 * Active le collapsible text pour les éléments descendants de celui dont l'id est spécifié en paramètres.
 * @param {string} id_element_parent id de l'élément parent des éléments à activer
 */
function activerCollapsibleTexts(id_element_parent) {
    // Configure/customize these variables.



    $('#' + id_element_parent + ' .more').each(function() {

        var content = $(this).html();

        if(content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);

            var html = c + 
                '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span>' + 
                '<span class="morecontent">' + 
                    '<span style="display: none;">' + h + '</span>' + 
                    '&nbsp;&nbsp;' + 
                    '<span class="link-primary morelink hand-cursor" onClick="clicOnSeeMore(this)">' + moretext + '</span>' + 
                '</span>';

            $(this).html(html);
        }

    });
}

function clicOnSeeMore(element) {
    console.log("Clic sur " + $(element).html());
    if($(element).hasClass("less")) {
        $(element).removeClass("less");
        $(element).html(moretext);
    } else {
        $(element).addClass("less");
        $(element).html(lesstext);
    }
    $(element).parent().prev().toggle();
    $(element).prev().toggle();
    return false;
}