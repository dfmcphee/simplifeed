//@prepros-append post-actions.js
//@prepros-append uploads.js
//@prepros-append lightbox.js
//@prepros-append liveurl.js

var $container;
var pageInitialized = false;
var activeUploads = 0;
var currentUpload = 0;

$(document).ready(function() {
  if (pageInitialized) {
    return;
  }
  pageInitialized = true;

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
});
