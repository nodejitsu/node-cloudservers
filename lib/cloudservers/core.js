/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var http = require('http');
 
var core = exports;

var authUrl = 'auth.api.rackspacecloud.com';

core.setAuth = function (options, callback) {
  var authClient = http.createClient(443, authUrl, true);
  var authRequest = authClient.request('GET', '/v1.0', {
    "HOST": authUrl,
    "X-AUTH-USER": options.username,
    "X-AUTH-KEY": options.apiKey
  });
  
  authRequest.on('response', function (response) {
    response.setEncoding('utf8');
    
    response.on("end", function (err, obj) {
      callback(err, response);
    });
  });
  
  authRequest.end();
};

core.getServers = function (callback) {
  
};

core.getServer = function (id, callback) {
  
};

core.createServer = function (callback) {
  
};