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
     apiKey: '76b0fdc1d3e6de08cdce9e568345470e'
  },
};

exports.config = new (Config);



