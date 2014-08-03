var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth
  , getAvatar = require('../helpers/files').getAvatar
  , mailerHelper = require('../helpers/mailer');

var Comments = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.before(requireAuth, {});

  this.create = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, {includes: {'user': null, 'comments': 'user'}}, function(err, post) {
      geddy.model.User.first(self.session.get('userId'), function(err, user) {
        if (err) {
          throw err;
        }

        var comment = geddy.model.Comment.create({content: params.content});

        comment.setUser(user);
        comment.setPost(post);

        if (user.id !== post.userId) {
          mailerHelper.createAndSend(
            user.fullName() + ' commented on your post.',
            '/posts/' + post.id,
            post.user
          );
        }

        if (post.comments) {
          for (var i=0; i < post.comments.length; i++){
            if (post.comments[i].user.id !== user.id && post.comments[i].user.id !== post.userId) {
              mailerHelper.createAndSend(
                user.fullName() + ' also commented on a post.',
                '/posts/' + post.id,
                post.comments[i].user
              );
            }
          }
        }

        var avatar = getAvatar(user);

        comment.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respond({success: true, comment: data, user: user, avatar: avatar}, {format: 'json'});
        });
      });
    });
  };

  this.update = function (req, resp, params) {
    var self = this;
    var userId = self.session.get('userId');

    geddy.model.Comment.first({userId: userId, id: params.id}, function(err, comment) {
      if (err) {
        throw err;
      }
      if (!comment) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        comment.updateProperties({content: params.content});

        if (!comment.isValid()) {
          self.respondWith(comment);
        }
        else {
          comment.save(function(err, data) {
            if (err) {
              throw err;
            }
            self.respond({success: true}, {format: 'json'});
          });
        }
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;
    var userId = self.session.get('userId');

    geddy.model.Comment.first({userId: userId, id: params.id}, function(err, comment) {
      if (err) {
        throw err;
      }
      if (!comment) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Comment.remove(comment.id, function(err) {
          if (err) {
            throw err;
          }
          self.respond({success: true}, {format: 'json'});
        });
      }
    });
  };

};

exports.Comments = Comments;
