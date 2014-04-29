var Notifications = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    var userId = self.session.get('userId');

    var options = {
      limit: 5,
      sort: {read: 'desc', createdAt: 'desc'}
    };

    geddy.model.Notification.all({userId: userId}, options, function(err, notifications) {
      if (err) {
        throw err;
      }
      self.respond({notifications: notifications}, {format: 'json'});
    });
  };

  this.read = function (req, resp, params) {
    var self = this;
    var userId = self.session.get('userId');

    geddy.model.Notification.first({userId: userId, id: params.id}, function(err, notification) {
      if (err) {
        throw err;
      }
      if (!notification) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        notification.updateProperties({read: true});

        notification.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respond({success: true}, {format: 'json'});
        });
      }
    });
  };

};

exports.Notifications = Notifications;
