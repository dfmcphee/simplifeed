var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth;
var getAvatar = require('../helpers/files').getAvatar;

var Comments = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.before(requireAuth, {});

  this.create = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, {includes: ['user']}, function(err, post) {
      geddy.model.User.first(self.session.get('userId'), function(err, user) {
        if (err) {
          throw err;
        }

        var comment = geddy.model.Comment.create({content: params.content});

        comment.setUser(user);
        comment.setPost(post);

        if (user.id !== post.userId) {
          geddy.model.Notification.createAndSend(
            user.fullName() + ' commented on your post.',
            '/posts/' + post.id,
            post.user
          );
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
            self.respondWith(comment, {status: err});
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
          self.respondWith(comment);
        });
      }
    });
  };

};

exports.Comments = Comments;
