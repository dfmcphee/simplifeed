var jqXHR;

$(document).ready(function() {
    $container = $('#post-uploads');
    $container.masonry({
      "gutter": 10,
      "columnWidth": 300
    });
    // layout Masonry again after all images have loaded
    $container.imagesLoaded( function() {
      $container.masonry({
        "gutter": 10,
        "columnWidth": 300
      });
    });

    jqXHR = $('#post-fileupload').fileupload({
        dataType: 'json',
        change: function (e, data) {
          activeUploads += data.files.length;
          $('#progress').show();
          $('body').append('<div id="imagelightbox-overlay"></div>');
        },
        drop: function (e, data) {
          activeUploads += data.files.length;
          $('#progress').show();
          $('body').append('<div id="imagelightbox-overlay"></div>');
        },
        done: function (e, data) {
          $.each(data.result.files, function (index, file) {
            var html = new EJS({url: '/js/templates/upload.ejs'}).render(file);

            html = $.parseHTML(html);

            $container.append($(html));
            imagesLoaded( document.querySelector('#post-uploads'), function( instance ) {
              $container.masonry('appended', $(html));
            });

            if (currentUpload++ === (activeUploads - 1)) {
              $('#progress').hide();
              $('#imagelightbox-overlay').remove();
              activeUploads = 0;
            }
          });
        }
    });

    $("body").on("dragover", function(event) {

      // Do something to UI to make page look droppable
      $('.upload-item').addClass('dragging');

      // Required for drop to work
      return false;
    });

    $("body").on("dragleave", function(event) {

      // Remove UI change
      $('.upload-item').removeClass('dragging');
    });

    $('#post-fileupload').bind('fileuploadprogress', function (e, data) {
      // Log the current bitrate for this upload:
      console.log(data);
    });

    $('#profile-fileupload').fileupload({
        dataType: 'json',
        change: function (e, data) {
          $('body').append('<div id="imagelightbox-overlay"><div id="profile-progress" class="csspinner traditional"></div></div>');
        },
        done: function (e, data) {
          $('#imagelightbox-overlay').remove();
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

      var defaultPhoto = '<img src="https://s3.amazonaws.com/simplifeed/placeholder.png" alt="profile photo">';
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
});
