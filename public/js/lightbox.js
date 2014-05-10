var curImages = new Array();

var activityIndicatorOn = function() {
  $( '<div id="imagelightbox-loading"><div class="csspinner traditional"></div></div>' ).appendTo( 'body' );
};
var activityIndicatorOff = function() {
  $( '#imagelightbox-loading' ).remove();
};
var overlayOn = function() {
  $('#imagelightbox-overlay').remove();
  $('<div id="imagelightbox-overlay"></div>').appendTo('body');
};
var overlayOff = function() {
  $('#imagelightbox-overlay').remove();
};
var captionOn = function() {
  var description = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'title' );
  if (description && description.length > 0) {
    $( '<div id="imagelightbox-caption">' + description + '</div>' ).appendTo( 'body' );
  }
};
var captionOff = function() {
  $( '#imagelightbox-caption' ).remove();
};

$(document).ready(function() {
  $('a.lightbox').imageLightbox({
    onLoadStart: function() {
      overlayOn();
      captionOff();
      activityIndicatorOn();
    },
    onLoadEnd: function() {
      captionOn();
      activityIndicatorOff();
    },
    onEnd: function() {
      overlayOff();
      captionOff();
    }
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      $('#imagelightbox-overlay').remove();
      $('#imagelightbox').remove();
      $('#progress').remove();

      if (jqXHR) {
        activeUploads = 0;
        jqXHR.abort();
      }
    }
  });
});
