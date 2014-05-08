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
          self.redirect('/posts');
        });
      } else {
        addUpload(i, keys, uploads, post, self);
      }
    });
  });
}

exports.removeUpload = function (filename) {
  geddy.uploadfs.remove(filename[0] + '.' + filename[1], function(e) {
    geddy.uploadfs.remove(filename[0] + '.small.' + filename[1], function(e) {
      geddy.uploadfs.remove(filename[0] + '.thumbnail.' + filename[1], function(e) {
      });
    });
  });
};

exports.getAvatar = function (user) {
  var avatar = 'https://s3.amazonaws.com/simplifeed/placeholder.png';
  if (user.profileThumb && user.profileThumb !== '') {
    avatar = user.profileThumb;
  }
  return avatar;
};
