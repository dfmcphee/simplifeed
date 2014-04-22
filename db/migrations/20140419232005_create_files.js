var CreateFiles = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('filename', 'string');
          t.column('title', 'string');
          t.column('full', 'string');
          t.column('small', 'string');
          t.column('thumbnail', 'string');
          t.column('postId', 'string');
          t.column('userId', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('files', def, callback);
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
    this.dropTable('files', callback);
  };
};

exports.CreateFiles = CreateFiles;
