var User = function () {
  this.defineProperties({
    username: {type: 'string', required: true, on: ['create', 'update']}
  , password: {type: 'string', required: true, on: ['create', 'update']}
  , familyName: {type: 'string', required: true}
  , givenName: {type: 'string', required: true}
  , email: {type: 'string', required: true, on: ['create', 'update']}
  , activationToken: {type: 'string'}
  , activatedAt: {type: 'datetime'}
  , profileImage: {type: 'string'}
  , profileThumb: {type: 'string'}
  , phone: {type: 'string'}
  , address: {type: 'string'}
  , emailNotifications: {type: 'boolean'}
  });

  this.validatesPresent('username', {message: 'Please enter a username.'});
  this.validatesLength('username', {min: 3, message: 'Username must be at least 3 characters.'});
  this.validatesPresent('password', {message: 'Please enter a password.'});
  this.validatesPresent('email', {message: 'Please enter your email address.'});
  this.validatesLength('password', {min: 8, message: 'Password must be at least 8 characters.'});
  this.validatesConfirmed('password', 'confirmPassword', {message: 'Your passwords did not match.'});
  this.validatesPresent('givenName', {message: 'Please enter your first name.'});
  this.validatesPresent('familyName', {message: 'Please enter your last name.'});

  this.hasMany('Passports');
  this.hasMany('Posts');
  this.hasMany('Likes');
  this.hasMany('Comments');
  this.hasMany('Files');

  this.fullName = function() {
	   return this.givenName + ' ' + this.familyName;
  };
};

User.prototype.isActive = function () {
  return !!this.activatedAt;
};

User = geddy.model.register('User', User);
