$(document).ready(function() {
  $.getJSON( "/notifications.json", function(data) {
    var notifications = '';

    if (data.notifications && data.notifications.length > 0) {
      $.each(data.notifications, function(key, notification) {
        notifications += '<li id="notification-' + key + '"><a href="' + notification.link + '">' + notification.content + '</a></li>';
      });
      $('#notifications').append(notifications);
      $('#notification-count').html(data.notifications.length);
    } else {
      $('#notifications').append('<li id="empty-notification"><a href="#">Nothing to see here.</a></li>');
    }
  });
});
