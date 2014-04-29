var geddy = require('geddy');

geddy.start({
  port: process.env.PORT || '4000',
  // you can manually set the environment, or configure to use
  // the node_env setting which is configurable via iisnode.yml
  // after the site is created.
  environment: 'development'
  // To configure based on NODE_ENV use the following:
  //environment: process.env.NODE_ENV || 'development'
});
