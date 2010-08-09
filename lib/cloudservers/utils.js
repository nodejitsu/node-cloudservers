/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers'),
    eyes = require('eyes'),
    request = require('request');

var utils = exports;
    
utils.rackspace = function (method, uri, callback, completed) {
  var args = Array.prototype.slice.call(arguments),
      completed = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      uri, method, requestBody;
      
  // Now that we've popped off the two callbacks
  // We can make decisions about other arguments
  if (args.length == 1) {
    
    if(typeof args[0] === 'string') {
      // If we got a string assume that it's the URI 
      method = 'GET';
      uri = args[0];
    }
    else {
      method = args[0]['method'] || 'GET',
      uri = args[0]['uri'];
      body = args[0]['body'];
    }
  }
  else {
    method = args[0];
    uri = args[1];
  }

  var serverOptions = {
    uri: uri,
    method: method,
    headers: {
      'X-AUTH-TOKEN': cloudservers.config.authToken,
      'Content-Type': 'application/json'
    }
  };

  request(serverOptions, function (err, res, body) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    // TODO: Parse the response code and create errors
    //       for error response code.

    completed(body, res);
  });
}