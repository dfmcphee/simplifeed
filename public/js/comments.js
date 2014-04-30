$(document).ready(function(){
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
              var count = Number($(commentButton).closest('.media').find('.comment-count').text());
              $(commentButton).closest('.media').find('.comment-count').html(count + 1);
              $(commentButton).closest('.comments').find('.comment-input').val('');
            }
          }
      });
    }
  });

  $('.comments').on('click', '.edit-comment', function(e) {
    var editButton = this;
    var commentBody = $(editButton).closest('.media-body');
    var content = commentBody.find('p.lead').text();
    commentBody.find('p.lead').hide();
    commentBody.find('.edit-comment').hide();

    var html = new EJS({url: '/js/templates/edit-comment.ejs'}).render();
    commentBody.append(html);

    commentBody.find('.comment-input').val(content);
  });

  $('.comments').on('click', '.cancel-comment', function(e) {
    var cancelButton = this;
    var commentBody = $(cancelButton).closest('.media-body');
    commentBody.find('.edit-comment').show();
    commentBody.find('p.lead').show();
    commentBody.find('.edit-comment-container').remove();
  });

  $('.comments').on('click', '.update-comment', function(e) {
    var updateButton = this;
    var commentId = $(updateButton).closest('.comment').data('comment-id');
    var content = $(updateButton).closest('.media').find('.comment-input').val();
    $.ajax({
        url: '/comments/' + commentId,
        type: 'PUT',
        data: 'content=' + content,
        success: function(data) {
          if (data && data.success) {
            var commentBody = $(updateButton).closest('.media-body');
            commentBody.find('.edit-comment').show();
            commentBody.find('p.lead').text(content);
            commentBody.find('p.lead').show();
            commentBody.find('.edit-comment-container').remove();
          }
        }
    });
  });

  $('.comments').on('click', '.delete-comment', function(e) {
    var deleteButton = this;
    var commentId = $(deleteButton).closest('.comment').data('comment-id');
    $.ajax({
        url: '/comments/' + commentId,
        type: 'DELETE',
        success: function(data) {
          if (data && data.success) {
            var commentBody = $(deleteButton).closest('.media-body');
            commentBody.closest('.comment').remove();
          }
        }
    });
  });
});
