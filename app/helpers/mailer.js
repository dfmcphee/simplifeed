exports.createAndSend = function (content, link, user) {
  var notification = geddy.model.Notification.create({
    content: content,
    link: link,
    userId: user.id
  });
  notification.save();

  if (user.emailNotifications) {
    var path = require('path')
    , templatesDir = path.resolve(__dirname, '../views/', 'emails')
    , emailTemplates = require('email-templates');

    emailTemplates(templatesDir, function(err, template) {
      var locals = {
        linkURL: geddy.config.protocol + '://' + geddy.config.externalHost + '/' + link,
        content: content,
        email: user.email
      };

      template('notification', locals, function(err, html, text) {
        if (err) {
          console.log(err);
        } else {
          geddy.sendMail({
            from: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost, // sender address
            to: locals.email, // comma separated list of receivers
            subject: content, // Subject line
            text: null,
            generateTextFromHTML: true,
            html: html
          });
        }
      });
    });
  }
};

exports.createAndSendToAll = function (content, link, sender) {
  var path = require('path')
  , templatesDir = path.resolve(__dirname, '../views/', 'emails')
  , emailTemplates = require('email-templates');

  geddy.model.User.all({id: {ne: sender}, emailNotifications: true}, function(err, users) {
    if (err) {
      throw err;
    }
    emailTemplates(templatesDir, function(err, template) {
      if (err) {
        throw err;
      }
      var linkURL = geddy.config.protocol + '://' + geddy.config.externalHost + '/' + link;

      var Render = function(locals) {
        this.locals = locals;
        this.send = function(err, html, text) {
          if (err) {
            console.log(err);
          } else {
            geddy.smtpTransport.sendMail({
              from: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost,
              to: locals.email,
              subject: content,
              html: html,
              generateTextFromHTML: true,
              text: null
            }, function(err, responseStatus) {
              if (err){
                  console.log('Error sending message: ' + err);
              } else {
                  console.log('Message sent: ' + responseStatus.message);
              }
            });
          }
        };
        this.batch = function(batch) {
          batch(this.locals, templatesDir, this.send);
        };
      };

      // Load the template and send the emails
      template('notification', true, function(err, batch) {
        for(var user in users) {
          var render = new Render({email: users[user].email, content: content, linkURL: linkURL});
          render.batch(batch);
        }
      });
    });
  });
};
