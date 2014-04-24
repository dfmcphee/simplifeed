$(document).ready(function() {
  $('.media-toolbar').on('click', '.like', function(e) {
    var likeButton = this;
    var postId = $(this).closest('.media').data('post-id');

    $.ajax({
        url: '/posts/' + postId + '/like',
        type: 'POST',
        success: function(data) {
          if (data && data.success) {
            $(likeButton).removeClass('like')
              .addClass('unlike');
            $(likeButton).find('.glyphicon')
              .removeClass('glyphicon-heart-empty')
              .addClass('glyphicon-heart');
          }
        }
    });
  });

  $('.media-toolbar').on('click', '.unlike', function(e) {
    var likeButton = this;
    var postId = $(this).closest('.media').data('post-id');

    $.ajax({
        url: '/posts/' + postId + '/unlike',
        type: 'POST',
        success: function(data) {
          if (data && data.success) {
            $(likeButton).removeClass('unlike')
              .addClass('like');
            $(likeButton).find('.glyphicon')
              .removeClass('glyphicon-heart')
              .addClass('glyphicon-heart-empty');
          }
        }
    });
  });
});
