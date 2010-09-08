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
     username: 'nodejitsudev', 
     apiKey: 'cd5d5f16f0735d932dfdf248b9fb8b92'
  },
};

exports.config = new (Config);



