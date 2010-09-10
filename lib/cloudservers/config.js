/*
 * config.js: Configuration information for your Rackspace Cloud account
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var Config = function () {

};
 
Config.prototype = {
  // Remark: Put your Rackspace API Key here
  auth: { 
     username: 'your-username', 
     apiKey: 'your-api-key'
  },
};

exports.config = new (Config);



