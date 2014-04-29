var Notification = function () {

  this.defineProperties({
    content: {type: 'string'},
    link: {type: 'string'},
    read: {type: 'boolean'}
  });

  this.belongsTo('User');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Notification.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Notification.someStaticMethod = function () {
  // Do some other stuff
};
Notification.someStaticProperty = 'YYZ';
*/

Notification.createAndSend = function (content, link, user) {
  var notification = geddy.model.Notification.create({
    content: content,
    link: link,
    userId: user.id
  });
  notification.save();

  if (user.emailNotifications) {
    var mailHtml = content + ' ' + '<a href="' + geddy.config.fullHostname + '/' + link + '">View</a>.';
    var mailText = content + geddy.config.fullHostname + '/' + link + '.';

    var mailOptions = {
      from: geddy.config.mailer.fromAddressUsername + '@' + geddy.config.externalHost,
      to: user.email,
      subject: content,
      html: mailHtml,
      text: mailText
    };

    geddy.sendMail(mailOptions);
  }
};

Notification = geddy.model.register('Notification', Notification);
