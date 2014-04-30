exports.uniqid = function (prefix, more_entropy) {
  //  discuss at: http://phpjs.org/functions/uniqid/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  revised by: Kankrelune (http://www.webfaktory.info/)
  //        note: Uses an internal counter (in php_js global) to avoid collision
  //        test: skip
  //   example 1: uniqid();
  //   returns 1: 'a30285b160c14'
  //   example 2: uniqid('foo');
  //   returns 2: 'fooa30285b1cd361'
  //   example 3: uniqid('bar', true);
  //   returns 3: 'bara20285b23dfd1.31879087'

  if (typeof prefix === 'undefined') {
    prefix = '';
  }

  var retId;
  var formatSeed = function(seed, reqWidth) {
    seed = parseInt(seed, 10)
      .toString(16); // to hex str
    if (reqWidth < seed.length) { // so long we split
      return seed.slice(seed.length - reqWidth);
    }
    if (reqWidth > seed.length) { // so short we pad
      return Array(1 + (reqWidth - seed.length))
        .join('0') + seed;
    }
    return seed;
  };

  // BEGIN REDUNDANT
  if (!this.php_js) {
    this.php_js = {};
  }
  // END REDUNDANT
  if (!this.php_js.uniqidSeed) { // init seed with big random int
    this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
  }
  this.php_js.uniqidSeed++;

  retId = prefix; // start with prefix, add current milliseconds hex string
  retId += formatSeed(parseInt(new Date()
    .getTime() / 1000, 10), 8);
  retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
  if (more_entropy) {
    // for more entropy we add a float lower to 10
    retId += (Math.random() * 10)
      .toFixed(8)
      .toString();
  }

  return retId;
};

exports.autoLink = function() {

};

exports.removeUserFieldsFromPosts = function(posts) {
  for (var i=0; i < posts.length; i++) {
    if (posts[i].user) {
      delete posts[i].user.password;
      delete posts[i].user.activationToken;
      delete posts[i].user.activatedAt;
      delete posts[i].user.emailNotifications;
    }

    if (posts[i].comments) {
      for (var j=0; j < posts[i].comments.length; j++) {
        delete posts[i].comments[j].user.password;
        delete posts[i].comments[j].user.activationToken;
        delete posts[i].comments[j].user.activatedAt;
        delete posts[i].comments[j].user.emailNotifications;
      }
    }
  }

  return posts;
};

exports.removeUserFieldsFromPost = function(post) {
  if (post.user) {
    delete post.user.password;
    delete post.user.activationToken;
    delete post.user.activatedAt;
    delete post.user.emailNotifications;
  }

  if (post.comments) {
    for (var i=0; i < post.comments.length; i++) {
      delete post.comments[i].user.password;
      delete post.comments[i].user.activationToken;
      delete post.comments[i].user.activatedAt;
      delete post.comments[i].user.emailNotifications;
    }
  }

  return post;
};

exports.removeFieldsFromUser = function(user) {
  delete user.password;
  delete user.activationToken;
  delete user.activatedAt;
  delete user.emailNotifications;

  return user;
};

exports.removeFieldsFromUsers = function(users) {
  for (var i=0; i < users.length; i++) {
    delete users[i].password;
    delete users[i].activationToken;
    delete users[i].activatedAt;
    delete users[i].emailNotifications;
  }

  return users;
};
