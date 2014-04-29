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
            var count = Number($(likeButton).closest('.media-toolbar').find('.like-count').text());
            $(likeButton).closest('.media-toolbar').find('.like-count').html(count + 1);
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
            var count = Number($(likeButton).closest('.media-toolbar').find('.like-count').text());
            $(likeButton).closest('.media-toolbar').find('.like-count').html(count - 1);
          }
        }
    });
  });

  $('.comments').on('click', '.add-comment', function(e) {
    var commentButton = this;
    var postId = $(commentButton).closest('.media').data('post-id');
    var content = $(commentButton).closest('.comments').find('.comment-input').val();

    if (content && content !== '') {
      $.ajax({
          url: '/posts/' + postId + '/comment',
          type: 'POST',
          data: 'content=' + content,
          success: function(data) {
            if (data && data.success) {
              var html = new EJS({url: '/js/templates/comment.ejs'}).render({
                comment: data.comment,
                user: data.user,
                avatar: data.avatar
              });
              $(commentButton).closest('.comments').find('.comment-list').append(html);
              var count = Number($(commentButton).closest('.media-toolbar').find('.comment-count').text());
              $(commentButton).closest('.media-toolbar').find('.comment-count').html(count + 1);
              $(commentButton).closest('.comments').find('.comment-input').val('');
            }
          }
      });
    }
  });
});
