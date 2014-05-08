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

    var pageLimit = 10;
    var currentPage = Number(params.currentPage) || 1;
    var skip = 0;
    if (currentPage > 1){
      skip = (currentPage * pageLimit) - pageLimit;
    }
    params.currentPage = currentPage;

    var idsOptions = {
      skip: skip,
      limit: pageLimit,
      sort: {
          createdAt: 'desc'
      }
    };

    var db = geddy.model.loadedAdapters.Post.client;

    db.query('SELECT count(*) AS count FROM posts;', function (err, result) {
        params.recordCount = Number(result.rows[0].count);
        params.totalPages = Math.ceil(params.recordCount / pageLimit);

        geddy.model.Post.all({}, idsOptions, function(err, posts) {
          if (err) {
            throw err;
          }

          var postIds = [];

          for (var i=0; i < posts.length; i++) {
            postIds.push(posts[i].id);
          }

          var options = {
            includes: {
              'user': null,
              'files': null,
              'likes': 'user',
              'comments': 'user'
            },
            sort: {
                createdAt: 'desc'
              , 'comments.createdAt': 'asc'
            }
          };

          geddy.model.Post.all({id: postIds}, options, function(err, posts) {
            if (err) {
              throw err;
            }

            posts = removeUserFieldsFromPosts(posts);

            self.respond({posts: posts, params: params});
          });
        });
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

            if (keys.length > 1) {
              geddy.model.Notification.createAndSendToAll(
                user.fullName() + ' posted an album to ' + geddy.config.appName,
                'posts/' + post.id,
                self.session.get('userId')
              );
            } else {
              geddy.model.Notification.createAndSendToAll(
                user.fullName() + ' posted a photo to ' + geddy.config.appName,
                'posts/' + post.id,
                self.session.get('userId')
              );
            }

            addUploadToPost(i, keys, params.uploads, post, self);
          });
        }
        else {
          post.save(function(err, data) {
            if (err) {
              throw err;
            }

            geddy.model.Notification.createAndSendToAll(
              user.fullName() + ' posted to ' + geddy.config.appName,
              'posts/' + post.id,
              self.session.get('userId')
            );

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
        'likes': 'user',
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
          self.flash.success('Post updated.');
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
