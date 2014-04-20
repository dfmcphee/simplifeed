var assert = require('assert')
  , tests
  , Post = geddy.model.Post;

tests = {

  'after': function (next) {
    // cleanup DB
    Post.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var post = Post.create({});
    post.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
