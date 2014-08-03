var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth
  , mailerHelper = require('../helpers/mailer');

var Likes = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.before(requireAuth, {});

  this.create = function (req, resp, params) {
    var self = this;
    var userId = self.session.get('userId');

    geddy.model.Post.first(params.id, {includes: ['user']}, function(err, post) {
      geddy.model.User.first(userId, function(err, user) {
        if (err) {
          throw err;
        }

        geddy.model.Like.first({userId: userId, postId: params.id}, function(err, like) {
          if (like) {
            throw new geddy.errors.BadRequestError('This user has already liked this post.');
          }
          var like = geddy.model.Like.create({});

          if (user.id !== post.userId) {
            mailerHelper.createAndSend(
              user.fullName() + ' liked your post.',
              '/posts/' + post.id,
              post.user
            );
          }

          like.setUser(user);
          like.setPost(post);

          like.save(function(err, data) {
            if (err) {
              throw err;
            }

            self.respond({success: true}, {format: 'json'});
          });
        });
      });
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;
    var userId = self.session.get('userId');

    geddy.model.Like.first({userId: userId, postId: params.id}, function(err, like) {
      if (err) {
        throw err;
      }
      if (!like) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Like.remove(like.id, function(err) {
          if (err) {
            throw err;
          }
          self.respond({success: true}, {format: 'json'});
        });
      }
    });
  };
};

exports.Likes = Likes;
