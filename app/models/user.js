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
  });

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');
  this.hasMany('Posts');
  this.hasMany('Likes');
  this.hasMany('Comments');
  this.hasMany('Files');

  this.fullName = function() {
	   return this.givenName + ' ' + this.familyName;
  };

  this.getAvatar = function() {
    var avatar = 'http://www.mrisug.org/Images/default.jpg';
    if (this.profileThumb && this.profileThumb !== '') {
      profileImage = this.profileThumb;
    }
    return avatar;
  };
};

User.prototype.isActive = function () {
  return !!this.activatedAt;
};

User = geddy.model.register('User', User);
