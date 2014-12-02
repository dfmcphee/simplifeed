/**
 * Send single email notification
 * @param {string} content - Subject of the notification
 * @param {string} link - URL for notification
 * @param {user} user - The person posting
 */
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
          if (geddy.config.mailer && geddy.config.mailer.transport.type == 'smtp') {
              geddy.sendMail({
                from: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost, // sender address
                to: locals.email, // comma separated list of receivers
                subject: content, // Subject line
                text: null,
                generateTextFromHTML: true,
                html: html
              });
          } else if (geddy.config.mailer && geddy.config.mailer.transport.type == 'mandrill') {
            var message = {
              from_name: geddy.config.appName,
              from_email: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost,
              to: [{email: locals.email, name: locals.email, type: 'to'}],
              subject: locals.content,
              html: html,
              text: text
            };

            mandrill_client.messages.send({message: message}, function(result) {
              console.log(result);

              // On success, return user who received email
              return rallyUser;
            }, function(e) {
              console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);

              // On fail, return false
              return false;
            });
          }
        }
      });
    });
  }
};

/*
 * Send a batch of notifications to all users receiving email
 * @param {string} content - Subject of the notification
 * @param {string} link - URL for notification
 * @param {user} sender - The person posting
 */
exports.createAndSendToAll = function (content, link, sender) {
  var path = require('path')
  , templatesDir = path.resolve(__dirname, '../views/', 'emails')
  , emailTemplates = require('email-templates');

  geddy.model.User.all({id: {ne: sender}, emailNotifications: true}, function(err, users) {
    if (err) {
      throw err;
    }

    var toEmails = [];

    for (var i=0; i < users.length; i++) {
      toEmails.push({email: users[i].email, name: users[i].fullName, type: 'bcc'});
    }

    emailTemplates(templatesDir, function(err, template) {
      var locals = {
        linkURL: geddy.config.protocol + '://' + geddy.config.externalHost + '/' + link,
        content: content,
        emails: toEmails
      };

      template('notification', locals, function(err, html, text) {
        if (err) {
          console.log(err);
        } else {

          if (geddy.config.mailer && geddy.config.mailer.transport.type == 'smtp') {
            geddy.sendMail({
              from: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost, // sender address
              bcc: locals.emails, // comma separated list of receivers
              subject: content, // Subject line
              text: null,
              generateTextFromHTML: true,
              html: html
            });
          } else if (geddy.config.mailer && geddy.config.mailer.transport.type == 'mandrill') {
            var mandrill = require('mandrill-api/mandrill');
            var mandrillToken = geddy.config.mailer.transport.options.auth.pass;
            var mandrill_client = new mandrill.Mandrill(mandrillToken);

            var message = {
              from_name: geddy.config.appName,
              from_email: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost,
              to: locals.emails,
              subject: locals.content,
              html: html,
              text: text
            };

            mandrill_client.messages.send({message: message}, function(result) {
              console.log(result);
            }, function(e) {
              console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);

              // On fail, return false
              return false;
            });
          }
        }
      });
    });
  });
};
