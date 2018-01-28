var visuelInstagram = function (pInfosVisuel) {

    var miniatures = pInfosVisuel.miniatures;
    var standard = pInfosVisuel.standard;
    var legende = pInfosVisuel.legende;

    // Conteneur global de notre image
    var conteneurVisuel = $('<div></div>').addClass('conteneurVisuel');


    // Lien permettant l'affichage de l'image
    var $lienZoom = $('<a></a>').attr({
        'href': standard,
        'target': '_blank'
    }).appendTo(conteneurVisuel);


    // l'image
    var image = $('<img>').attr({
        'src': miniatures
    }).on('load', function () {
        image.appendTo(conteneurVisuel);
        $(document).trigger('galerieInstagram.imageAffiche');
    });

    // Légende de la photo
    var legende = $('<p></p>').text(legende).appendTo(conteneurVisuel);

    return conteneurVisuel;
}

$(function () {

    var visuel;
    var visuelEnCours = 0;
    var arrayDesVisuels = [];
    var nbVisuels;
    var conteneurGalerie = $('#conteneurGalerie');

    // Chargement du flux instagram
    var urlFlux = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=32456951.1677ed0.16d07f738f5f44c18e6df6016e20e50f&callback=?';
    $.getJSON(urlFlux, {
        format: 'json'
    }).done(construitGalerie);

    // La galerie
    function construitGalerie(data) {
        // construction de l'array des visuels
        $.each(data.data, function (index, element) {
            var legende;
            if (element.caption == null) { legende = 'Code jQuery'; } else { legende = element.caption.text; }
            arrayDesVisuels.push({
                'miniatures': element.images.low_resolution.url,
                'standard': element.images.standard_resolution.url,
                'legende': legende
            });
        });
        nbVisuels = arrayDesVisuels.length;
        construitVisuel();
    }

    // Le visuel
    function construitVisuel() {
        if (visuelEnCours < nbVisuels) {
            visuel = new visuelInstagram(arrayDesVisuels[visuelEnCours]);
            visuel.appendTo(conteneurGalerie).fadeIn('slow');
            visuelEnCours++;
        }
    }

    // event galerieInstagram.imageAffiche
    $(document).on('galerieInstagram.imageAffiche', construitVisuel);

});