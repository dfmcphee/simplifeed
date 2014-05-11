//@prepros-append post-actions.js
//@prepros-append uploads.js
//@prepros-append notifications.js
//@prepros-append comments.js
//@prepros-append lightbox.js
//@prepros-append liveurl.js

var $container;
var pageInitialized = false;
var sizeRangeSuffixes = {
  'lt100':'',
  'lt240':'',
  'lt320':'',
  'lt500':'',
  'lt640':'',
  'lt1024':''
};

$(document).ready(function() {
  if (pageInitialized) {
    return;
  }
  pageInitialized = true;

  $('.justified-gallery').justifiedGallery({
    sizeRangeSuffixes: sizeRangeSuffixes
  });

  $("abbr.timeago").timeago();
});

var getAvatar = function (user) {
  var avatar = 'https://s3.amazonaws.com/simplifeed/placeholder.png';
  if (user.profileThumb && user.profileThumb !== '') {
    avatar = user.profileThumb;
  }
  return avatar;
};
