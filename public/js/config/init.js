// Use this file to do all of your initial setup - this will be run after
// core/core.js and all of your models.

/*
 *  to set up realtime for your specific models
 *  pass an array of model names into the method
 *  below:                                         */

// geddy.io.addListenersForModels();

/*
 *  example:
 *
 *  geddy.io.addListenersForModels(['Item']);
 *
 *  geddy.model.Item.on('save', function (item) {
 *    console.log(item);
 *  });
 *
 *  geddy.model.Item.on('update', function (item) {
 *    console.log(item);
 *  });
 *
 *  geddy.model.Item.on('remove', function (id) {
 *    console.log(id);
 *  });
 *
 */

var curImages = new Array();
var $container;

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

var pageInitialized = false;

$(document).ready(function() {
  if (pageInitialized) {
    return;
  }
  pageInitialized = true;


  $container = $('#post-uploads');
  // layout Masonry again after all images have loaded
  $container.imagesLoaded( function() {
    $container.masonry({
      "gutter": 10
    });
  });

  $('#post-fileupload').fileupload({
      dataType: 'json',
      change: function (e, data) {
        $('#progress').show();
      },
      done: function (e, data) {
        $('#progress').hide();
        $.each(data.result.files, function (index, file) {
          var html = new EJS({url: '/js/templates/upload.ejs'}).render(file);

          html = $.parseHTML(html);

          $container.append($(html)).masonry('appended', $(html));
        });
      }
  });

  $('#profile-fileupload').fileupload({
      dataType: 'json',
      change: function (e, data) {
        $('#profile-progress').show();
      },
      done: function (e, data) {
        $('#profile-progress').hide();
        $.each(data.result.files, function (index, file) {
          var html = new EJS({url: '/js/templates/profile-photo.ejs'}).render(file);
          $('#profile-photo').html(html);
        });
      }
  });

  $('body').on('click', '.btn-remove-upload', function(e) {
    e.preventDefault();
    var upload = this;
    var action = $(this).data('action');

    $.ajax({
        url: action,
        type: 'DELETE',
        success: function(data) {
          if (data && data.success) {
            $(upload).closest('.upload').remove();
            $container.masonry();
          }
        }
    });
    return false;
  });

  $('body').on('click', '.btn-remove-profile-photo', function(e) {
    e.preventDefault();
    var upload = this;
    var action = $(this).data('action');

    var defaultPhoto = '<img src="http://www.mrisug.org/Images/default.jpg" alt="profile photo">';
    defaultPhoto += '<input type="hidden" name="profileFile" value="" />';

    $.ajax({
        url: action,
        type: 'DELETE',
        success: function(data) {
          if (data && data.success) {
            $(upload).closest('.upload').remove();
            $('#profile-photo').html();
          }
        }
    });
    return false;
  });

  $('.justified-gallery').justifiedGallery({
    sizeRangeSuffixes: {
      'lt100':'',
      'lt240':'',
      'lt320':'',
      'lt500':'',
      'lt640':'',
      'lt1024':''
    }
  });

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

  $('#post-form textarea').liveUrl({
      loadStart : function(){
          $('.liveurl-loader').show();
      },
      loadEnd : function(){
          $('.liveurl-loader').hide();
      },
      success : function(data)
      {
          var output = $('.liveurl');
          output.find('.title').text(data.title);
          output.find('.description').text(data.description);
          output.find('.url').text(data.url);
          output.find('.image').empty();

          output.find('.close').one('click', function()
          {
              var liveUrl     = $(this).parent();
              liveUrl.hide('fast');
              liveUrl.find('.video').html('').hide();
              liveUrl.find('.image').html('');
              liveUrl.find('.controls .prev').addClass('inactive');
              liveUrl.find('.controls .next').addClass('inactive');
              liveUrl.find('.thumbnail').hide();
              liveUrl.find('.image').hide();

              $('textarea').trigger('clear');
              curImages = new Array();
          });

          output.show('fast');

          if (data.video != null) {
              var ratioW        = data.video.width  /350;
              data.video.width  = 350;
              data.video.height = data.video.height / ratioW;

              var video =
              '<object width="' + data.video.width  + '" height="' + data.video.height  + '">' +
                  '<param name="movie"' +
                        'value="' + data.video.file  + '"></param>' +
                  '<param name="allowScriptAccess" value="always"></param>' +
                  '<embed src="' + data.video.file  + '"' +
                        'type="application/x-shockwave-flash"' +
                        'allowscriptaccess="always"' +
                        'width="' + data.video.width  + '" height="' + data.video.height  + '"></embed>' +
              '</object>';
              output.find('.video').html(video).show();


          }
      },
      addImage : function(image)
      {
          var output  = $('.liveurl');
          var jqImage = $(image);
          jqImage.attr('alt', 'Preview');

          if ((image.width / image.height)  > 7
          ||  (image.height / image.width)  > 4 ) {
              // we dont want extra large images...
              return false;
          }

          curImages.push(jqImage.attr('src'));
          output.find('.image').append(jqImage);


          if (curImages.length == 1) {
              // first image...

              output.find('.thumbnail .current').text('1');
              output.find('.thumbnail').show();
              output.find('.image').show();
              jqImage.addClass('active');

          }

          if (curImages.length == 2) {
              output.find('.controls .next').removeClass('inactive');
          }

          output.find('.thumbnail .max').text(curImages.length);
      }
  });


  $('.liveurl ').on('click', '.controls .button', function() {
      var self        = $(this);
      var liveUrl     = $(this).parents('.liveurl');
      var content     = liveUrl.find('.image');
      var images      = $('img', content);
      var activeImage = $('img.active', content);

      if (self.hasClass('next'))
           var elem = activeImage.next("img");
      else var elem = activeImage.prev("img");

      if (elem.length > 0) {
          activeImage.removeClass('active');
          elem.addClass('active');
          liveUrl.find('.thumbnail .current').text(elem.index() +1);

          if (elem.index() +1 == images.length || elem.index()+1 == 1) {
              self.addClass('inactive');
          }
      }

      if (self.hasClass('next'))
           var other = elem.prev("img");
      else var other = elem.next("img");

      if (other.length > 0) {
          if (self.hasClass('next'))
                 self.prev().removeClass('inactive');
          else   self.next().removeClass('inactive');
     } else {
          if (self.hasClass('next'))
                 self.prev().addClass('inactive');
          else   self.next().addClass('inactive');
     }
  });
});
