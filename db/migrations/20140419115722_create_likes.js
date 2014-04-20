var CreateLikes = function () {
  this.up = function (next) {
    var def = function (t) {
      t.column('userId', 'string');
      t.column('postId', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('like', def, callback);
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
    this.dropTable('like', callback);
  };
};

exports.CreateLikes = CreateLikes;
