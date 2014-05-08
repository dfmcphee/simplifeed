// Use this file to do all of your initial setup - this will be run after
// core/core.js and all of your models.

/*
 *  to set up realtime for your specific models
 *  pass an array of model names into the method
 *  below:                                         */

geddy.io.addListenersForModels();

geddy.io.addListenersForModels(['Notification']);

geddy.model.Notification.on('save', function (item) {
  if (item.userId === userId) {
    var html = new EJS({url: '/js/templates/notification.ejs'}).render({notification: item, unread: 'unread'});
    $('#notifications').prepend(html);

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

geddy.io.addListenersForModels(['Post']);

geddy.model.Post.on('save', function (item) {
  setTimeout(function(){
    $.getJSON( '/posts/' + item.id + '.json', function(data) {
      var html = new EJS({url: '/js/templates/post.ejs'}).render({post: data});
      $('#posts-list').prepend(html);
      $('#post-' + item.id).fadeIn('slow');
      $('#post-' + item.id + ' .justified-gallery').justifiedGallery({
        sizeRangeSuffixes: sizeRangeSuffixes
      });
    });
  }, 1000);
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
