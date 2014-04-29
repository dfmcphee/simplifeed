$(document).ready(function() {
  $.getJSON( "/notifications.json", function(data) {
    var notifications = '';
    var unreadCount = 0;

    if (data.notifications && data.notifications.length > 0) {
      $.each(data.notifications, function(key, notification) {
        var unreadClass = '';
        if (!notification.read) {
          unreadClass = 'unread';
          unreadCount++;
        }

        notifications += '<li id="notification-' + notification.id +
        '" class="' + unreadClass + '"><a data-id="' + notification.id + '" data-href="' +
        notification.link + '">' + notification.content + '</a></li>';
      });
      $('#notifications').append(notifications);

      if (unreadCount > 0) {
        $('#notification-count').html(unreadCount);
        $('#notification-count').addClass('unread');
      }
    } else {
      $('#notifications').append('<li id="empty-notification"><a href="#">Nothing to see here.</a></li>');
    }
  });

  $('#notifications').on('click', 'li a', function() {
    notification = this;
    if ($(notification).closest('li').hasClass('unread')) {
      $.ajax({
          url: '/notifications/' + $(notification).data('id') + '/read',
          type: 'PUT',
          success: function(result) {
            if (result.success) {
              $(location).attr('href', $(notification).data('href'));
            }
          }
      });
    } else {
      $(location).attr('href', $(notification).data('href'));
    }
  });
});
