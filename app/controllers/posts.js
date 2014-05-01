var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth
  , addUploadToPost = require('../helpers/files').addUploadToPost
  , removeUpload = require('../helpers/files').removeUpload
  , removeUserFieldsFromPost = require('../helpers/general').removeUserFieldsFromPost
  , removeUserFieldsFromPosts = require('../helpers/general').removeUserFieldsFromPosts;

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
      includes: {
        'user': null,
        'files': null,
        'likes': null,
        'comments': 'user'
      },
      sort: {
          createdAt: 'desc'
        , 'comments.createdAt': 'asc'
      }
    };

    geddy.model.Post.all({}, options, function(err, posts) {
      if (err) {
        throw err;
      }

      posts = removeUserFieldsFromPosts(posts);

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

            if (params.format && params.format === 'json') {
              self.respond(post, {format: 'json'});
            } else {
              self.redirect('/posts');
            }
          });
        }
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    var options = {
      includes: {
        'user': null,
        'files': null,
        'likes': null,
        'comments': 'user'
      },
      sort: {
          createdAt: 'asc'
      }
    };

    geddy.model.Post.first(params.id, options, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        post = removeUserFieldsFromPost(post);
        var response = {post: post, commentsCollapse: 'in'};
        if (params.format && params.format === 'json') {
          response = post;
        }
        self.respond(response);
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

    var userId = self.session.get('userId');

    var options = {
      includes: {
        'files': null,
        'likes': null,
        'comments': null
      }
    };

    geddy.model.Post.first(params.id, options, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.BadRequestError();
      }
      if (post.userId !== userId) {
        throw new geddy.errors.BadRequestError('You are not the owner of this post.');
      }
      else {
        var removeCallback = function (err, data) {
          if (err) {
            throw err;
          }
        };

        if (post.comments) {
          for (var i=0; i < post.comments.length; i++) {
            geddy.model.Comment.remove(post.comments[i].id, removeCallback);
          }
        }

        if (post.likes) {
          for (var i=0; i < post.likes.length; i++) {
            geddy.model.Like.remove(post.likes[i].id, removeCallback);
          }
        }

        if (post.files) {
          for (var i=0; i < post.files.length; i++) {
            var filename = post.files[i].filename.split('.');
            removeUpload(filename);
            geddy.model.File.remove(post.files[i].id, removeCallback);
          }
        }

        geddy.model.Post.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          if (params.format && params.format === 'json') {
            self.respond(post, {format: 'json'});
          } else {
            self.redirect('/posts');
          }
        });
      }
    });
  };

};

exports.Posts = Posts;
