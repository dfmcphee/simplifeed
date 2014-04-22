var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth
  , addUploadToPost = require('../helpers/files').addUploadToPost;

var Posts = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.before(requireAuth, {});

  this.index = function (req, resp, params) {
    var self = this;

    var limit = 10;
    var skip = 0;

    if (params.page) {
      skip = (params.page * limit) - limit;
    }

    var options = {
      sort: {createdAt: 'desc'},
      includes: ['user', 'files']
    };

    geddy.model.Post.all({}, options, function(err, posts) {
      if (err) {
        throw err;
      }
      self.respondWith(posts, {type:'Post'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , post = geddy.model.Post.create(params);

    if (!post.isValid()) {
      this.respondWith(post);
    }
    else {
      geddy.model.User.first(self.session.get('userId'), function(err, user) {
        if (err) {
          throw err;
        }

        post.setUser(user);

        if (params.uploads) {
          post.save(function(err, data) {
            var keys = Object.keys(params.uploads);
            var i = 0;

            addUploadToPost(i, keys, params.uploads, post, self);
          });
        }
        else {
          post.save(function(err, data) {
            if (err) {
              throw err;
            }
            self.respondWith(post, {status: err});
          });
        }
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    var options = {
      includes: ['user', 'files']
    };

    geddy.model.Post.first(params.id, options, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(post);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    var options = {
      includes: ['files']
    };

    geddy.model.Post.first(params.id, options, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(post);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      }
      post.updateProperties(params);

      if (!post.isValid()) {
        self.respondWith(post);
      }
      else {
        post.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(post, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        if (params.uploads) {
          var keys = Object.keys(params.uploads);
          var i = 0;

          addUploadToPost(i, keys, params.uploads, post, self);
        }
        else {
          post.save(function(err, data) {
            if (err) {
              throw err;
            }
            self.respondWith(post, {status: err});
          });
        }
      }
    });
  };

};

exports.Posts = Posts;
