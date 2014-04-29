var CreateNotifications = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('userId', 'string');
          t.column('content', 'string');
          t.column('link', 'string');
          t.column('read', 'boolean');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('notification', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('notification', callback);
  };
};

exports.CreateNotifications = CreateNotifications;
