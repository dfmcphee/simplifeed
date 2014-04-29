// Use this file to do all of your initial setup - this will be run after
// core/core.js and all of your models.

/*
 *  to set up realtime for your specific models
 *  pass an array of model names into the method
 *  below:                                         */

geddy.io.addListenersForModels();

geddy.io.addListenersForModels(['Notification']);

geddy.model.Notification.on('save', function (item) {
  console.log(item);

  if (item.userId === userId) {
    var notification = '<li id="notification-' + item.id + '"><a href="' + item.link + '">' + item.content + '</a></li>';
    $('#notifications').prepend(notification);

    var count = Number ($('#notification-count').text());
    count++;

    $('#notification-count').html(count);
    $('#notification-count').addClass('unread');

    $('#empty-notification').remove();
  }
});

geddy.model.Notification.on('update', function (item) {
  console.log(item);
});

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
