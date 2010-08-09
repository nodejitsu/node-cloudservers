/*
 * config.js: Configuration information for your Rackspace Cloud account
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var url = require('url');
 
var Config = function () {
  
  var self = this;
  ['serverUrl', 'storageUrl', 'cdnUrl'].forEach(function (path) {
    var field = '_' + path;

    self.__defineGetter__(path, function () {
      return this[field];
    });

    self.__defineSetter__(path, function (value) {
      if(value) {
        this[field] = url.parse(value);
      }
    });
  });
};
 
Config.prototype = {
  // Remark: Put your Rackspace API Key here
  auth: { 
     username: 'your-rackspace-username',
     apiKey: 'your-rackspace-api-key'
  },
};

exports.config = new (Config);



