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
     username: 'nodejitsu', 
     apiKey: '87b0ccdd4ba937b916c3afdcd673ea79'
  },
};

exports.config = new (Config);



