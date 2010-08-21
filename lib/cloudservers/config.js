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
     username: 'your-secret-username', 
     apiKey: 'your-secret-apikey'
  },
};

exports.config = new (Config);



