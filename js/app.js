var visuelInstagram = function(pInfosVisuel) {
  var miniatures    = pInfosVisuel.miniatures;
  var standard      = pInfosVisuel.standard;
  var legende       = pInfosVisuel.legende;

  // Conteneur global de notre image
  var conteneurVisuel = $('<div></div>').addClass('conteneurVisuel');

  // Lien permettant l'affichage de l'image
  var lienZoom = $('<a class="lightbox"></a>').attr({
    'href': standard,
  }).appendTo(conteneurVisuel);

  // Lightbox
  $(lienZoom).each(function () {
    $(this).on('click', function(e) {
      e.preventDefault();
      var url_image = $(this).attr('href');
      var lightbox = `
      <div id="fond-noir">
        <div id="contenu">
          <div id="close"></div>
            <img src = "${url_image}"/>
            <div id="title">${legende}</div>
        </div>
      </div>
    `;
      $('<p id="title"></p>').text(legende);
      $('body').append(lightbox).hide().fadeIn(100);
      $(document).on('click', '#close', function () {
        $('#fond-noir').remove();
      });
      $( "#title:empty" ).css( "display", "none" );
    });

    // Fermer la photo si l'utilisateur click en dehors.
    var clickInside = false;

    $('#fond-noir').hover(function () {
      clickInside = true;
    }, function () {
      clickInside = false;
    });

    $("body").mouseup(function () {
      if (!clickInside)
        $('#fond-noir').remove();
    });
  });

  // l'image
  var image = $('<img>').addClass('photo').attr({
    'src': miniatures
  }).on('load', function () {
    image.prependTo(conteneurVisuel);
    $(document).trigger('galerieInstagram.imageAffiche'); // Event perso 
  });

  return conteneurVisuel;

  
}


$(function () {
  var visuel;
  var visuelEnCours     = 0;
  var arrayDesVisuels   = [];
  var nbVisuels;
  var conteneurGalerie  = $('#conteneurGalerie');
  var conteneurLegende  = $('#title');

  // Chargement du flux instagram
  // &callback signifie que le flux sera pris en charge par une function après sont téléchargement
  var urlFlux = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=32456951.1677ed0.75d9f5ce09484feca282090c724d2652&callback=?';
  $.getJSON(urlFlux, {
    format: 'json'
  }).done(construitGalerie);

  // La galerie
  function construitGalerie(data) {
    console.log(data);

    // construction de l'array contenant les visuels
    $.each(data.data, function (index, element) { 
      // data.data http://prntscr.com/kvwelm // Element représente chaque objet de l'array

      if (element.caption == null )
        legende = "";
      else { legende = element.caption.text; }
      arrayDesVisuels.push({
        'miniatures': element.images.low_resolution.url,
        'standard': element.images.standard_resolution.url,
        'legende': legende
      });
    });
    nbVisuels = arrayDesVisuels.length;
    console.log(arrayDesVisuels);
    construitVisuel();
  }

  // Le visuel
  function construitVisuel() {
    if (visuelEnCours < nbVisuels) {
      visuel = new visuelInstagram(arrayDesVisuels[visuelEnCours]); // arrayDesVisuels[0]
      visuel.appendTo(conteneurGalerie).fadeIn('slow');
      visuelEnCours++;
    }
  }

  // event galerieInstagram.imageAffiche
  $(document).on('galerieInstagram.imageAffiche', construitVisuel);

});

