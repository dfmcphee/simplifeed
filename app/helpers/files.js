exports.addUploadToPost = function (i, keys, uploads, post, self) {
  addUpload(i, keys, uploads, post, self);
};

function addUpload(i, keys, uploads, post, self) {
  var key = keys[i];

  geddy.model.File.first(uploads[key].id, function(err, file) {
    if (err) {
      throw err;
    }

    file.title = uploads[key].title;
    file.save(function(err, data) {
      post.addFile(file);

      if (i++ === keys.length - 1) {
        post.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(post, {status: err});
        });
      } else {
        addUpload(i, keys, uploads, post, self);
      }
    });
  });
}

exports.getAvatar = function (user) {
  var avatar = 'http://www.mrisug.org/Images/default.jpg';
  if (user.profileThumb && user.profileThumb !== '') {
    avatar = user.profileThumb;
  }
  return avatar;
};
