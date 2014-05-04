var passport = require('../helpers/passport')
  , generateHash = passport.generateHash
  , hat = require('hat')
  , requireAuth = passport.requireAuth
  , removeFieldsFromUser = require('../helpers/general').removeFieldsFromUser
  , removeFieldsFromUsers = require('../helpers/general').removeFieldsFromUsers
  , removeUserFieldsFromPosts = require('../helpers/general').removeUserFieldsFromPosts;

var Users = function () {

  // Set this to false if you don't need e-mail activation
  // for local users
  var EMAIL_ACTIVATION = false
    , msg;

  if (EMAIL_ACTIVATION) {
    if (!geddy.mailer) {
      msg = 'E-mail activation requires a mailer. ' +
          'Please configure a mailer for your app.';
      throw new Error(msg);
    }
    if (!geddy.config.fullHostname) {
      msg = 'E-mail activation requires a hostname for the ' +
          'activation URL. Please set "hostname" in your app config.';
      throw new Error(msg);
    }
  }

  this.before(requireAuth, {
    except: ['add', 'create', 'activate', 'forgotPassword', 'resetPassword', 'setPassword', 'updatePassword']
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function(err, users) {
      users = removeFieldsFromUsers(users);
      self.respond({params: params, users: users});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params)
      , sha;

    if (params.sitePassword !== geddy.config.password) {
      params.errors = {};
      params.errors.sitePassword = 'The site password you entered is incorrect.';
      self.respond({user: params}, {template: 'users/add'});
    }

    if (params.emailNotifications === '1') {
      user.emailNotifications = true;
    } else {
      user.emailNotifications = false;
    }

    // Non-blocking uniqueness checks are hard
    geddy.model.User.first({username: user.username}, function(err, data) {
      var activationUrl;
      if (err) {
        throw err;
      }
      if (data) {
        user.errors  = {
          username: 'This username is already in use.'
        };
        self.respondWith(user);
      }
      else {
        if (user.isValid()) {
          user.password = generateHash(user.password);

          if (EMAIL_ACTIVATION) {
            user.activationToken = generateHash(user.email);
          }
          else {
            user.activatedAt = new Date();
          }
          user.save(function(err, data) {
            var options = {}
              , mailOptions
              , mailCallback
              , mailHtml
              , mailText;

            if (err) {
              throw err;
            }

            if (EMAIL_ACTIVATION) {
              activationUrl = geddy.config.fullHostname + '/users/activate?token=' +
                  encodeURIComponent(user.activationToken);
              options.status = 'You have successfully signed up. ' +
                  'Check your e-mail to activate your account.';

              mailHtml = 'Welcome to ' + geddy.config.appName + '. ' +
                  'Use the following URL to activate your account: ' +
                  '<a href="' + activationUrl + '">' + activationUrl + '</a>.';
              mailText = 'Welcome to ' + geddy.config.appName + '. ' +
                  'Use the following URL to activate your account: ' +
                  activationUrl + '.';

              mailOptions = {
                from: geddy.config.mailer.fromAddressUsername + '@' +
                    geddy.config.hostname
              , to: user.email
              , subject: 'Welcome to ' + geddy.config.appName
              , html: mailHtml
              , text: mailText
              };
              mailCallback = function (err, data) {
                if (err) {
                  throw err;
                }
                self.respondWith(user, options);
              };
              geddy.mailer.sendMail(mailOptions, mailCallback);
            }

            else {
              self.flash.success('Your account has been created. Please sign in now.');
              self.respondWith(user);
            }
          });
        }
        else {
          self.respond({user: user}, {template: 'users/add'});
        }
      }
    });

  };

  this.activate = function (req, res, params) {
    var self = this
      , token = decodeURIComponent(params.token);

    geddy.model.User.first({activationToken: token}, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.NotFoundError(
            'Sorry, couldn\'t find the user with that activation code.');
      }
      user.activatedAt = new Date();
      user.save(function (err) {
        if (err) {
          throw err;
        }
        self.flash.success('Congrats. Your account has been activated. You may now log in.');
        self.redirect('/login');
      });
    });

  };

  this.show = function (req, resp, params) {
    var self = this;
    var userOptions = {};

    var postsOptions = {
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

    geddy.model.User.first(params.id, userOptions, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        user.getPosts({}, postsOptions, function (err, posts) {
          user = removeFieldsFromUser(user);
          posts = removeUserFieldsFromPosts(posts);
          self.respond({user: user, posts: posts});
        });
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    var userId = self.session.get('userId');

    geddy.model.User.first(userId, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(user);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    var userId = self.session.get('userId');

    geddy.model.User.first(userId, function(err, user) {
      // Only update password if it's changed
      var skip = params.password ? [] : ['password'];

      user.updateAttributes(params, {skip: skip});
      if (params.emailNotifications === '1') {
        user.emailNotifications = true;
      } else {
        user.emailNotifications = false;
      }

      if (!user.isValid()) {
        self.respond({user: user}, {template: 'users/edit'});
      }
      else {
        if (params.password) {
          user.password = generateHash(user.password);
        }

        user.save(function(err, data) {
          if (err) {
            throw err;
          }

          self.flash.success('Profile successfully updated.');
          self.respondWith(user, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    var userId = self.session.get('userId');

    geddy.model.User.first(userId, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.User.remove(userId, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(user);
        });
      }
    });
  };

  this.forgotPassword = function (req, resp, params) {
    this.respond({params: params});
  };

  this.resetPassword = function (req, resp, params) {
    var self = this;

    geddy.model.User.first({email: params.email}, function(err, user) {
      if (err) {
        params.errors = err;
        self.transfer('forgotPassword');
      }
      else if (!user) {
        params.errors = ['No user found with that email.'];
        self.transfer('forgotPassword');
      } else {
        var token = hat();

        user.activationToken = token;

        var resetURL = geddy.config.protocol + '://' + geddy.config.externalHost + '/set-password?token=' +
            encodeURIComponent(token);

        geddy.sendMail({
          from: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost, // sender address
          to: user.fullName() + ' <' + user.email + '>', // comma separated list of receivers
          subject: geddy.config.appName + " Password Reset", // Subject line
          text: 'You requested to reset your password. Please go to ' + resetURL + ' to reset your password.',
          html: 'You requested to reset your password. Please go <a href="' + resetURL + '">here</a> to reset your password.'
        });

        user.save(function(err, data) {
          if (err) {
            params.errors = err;
            self.transfer('forgotPassword');
          }
          else {
            self.flash.success('An email has been sent with a link to reset your password.');
            self.redirect({controller: self.name});
          }
        });
      }
    });
  };

  this.setPassword = function (req, resp, params) {
    this.respond({params: params});
  };

  this.updatePassword = function (req, resp, params) {
    var self = this;

    geddy.model.User.first({activationToken: params.token}, function(err, user) {
      if (err) {
        params.errors = err;
        self.transfer('setPassword');
      }
      else if (!user) {
        params.errors = ['No user found with that token.'];
        self.transfer('setPassword');
      }
      else if (params.password && params.password !== '' && params.password !== params.confirmPassword) {
        params.errors = ['Password do not match.'];
        self.transfer('setPassword');
      } else {
        user.activationToken = null;
        user.password = generateHash(params.password);

        user.save(function(err, data) {
          if (err) {
            params.errors = err;
            self.transfer('forgotPassword');
          }
          else {
            self.flash.success('Your password has been successfully reset.');
            self.redirect({controller: self.name});
          }
        });
      }
    });
  };

  this.invite = function (req, resp, params) {
    this.respond({params: params});
  };

  this.sendInvite = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(self.session.get('userId'), function(err, sender) {
      geddy.model.User.first({email: params.email}, function(err, user) {
        if (err) {
          params.errors = err;
          self.transfer('invite');
        }
        else if (user) {
          params.errors = ['There is already a member with that email address.'];
          self.transfer('invite');
        }
        else {
          var signupURL = geddy.configprotocol + '://' + geddy.config.exteralHost + '/users/add?sitePassword=' + encodeURIComponent(geddy.config.password);

          geddy.sendMail({
            from: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost, // sender address
            to: params.email, // comma separated list of receivers
            subject: 'You have been invited to ' + geddy.config.appName, // Subject line
            text: sender.fullName() + ' has invited you to join ' + geddy.config.appName + ' please go to ' + signupURL + ' to sign up.',
            html: sender.fullName() + ' has invited you to join ' + geddy.config.appName + ' please go <a href="' + signupURL + '">here</a> to sign up.'
          });

          self.flash.success('An invitation has been sent to the email address you provided.');
          self.transfer('invite');
        }
      });
    });
  };
};

exports.Users = Users;
