/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers'),
    sys = require('sys'),
    eyes = require('eyes'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    request = require('request');

var utils = exports;

var failCodes = {
  400: "Bad Request",
  401: "Unauthorized",
  413: "Over Limit",
  503: "Service Unavailable"
};

var successCode = {
  200: "OK",
  202: "Accepted",
  203: "Non-authoritative information",
  204: "No content",
};
    
utils.rackspace = function () {
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
      requestBody = args[0]['body'];
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
      'X-AUTH-TOKEN': cloudservers.config.authToken
    }
  };
  
  if (typeof requestBody !== 'undefined') {
    serverOptions.headers['Content-Type'] = 'application/json';
    serverOptions.body = JSON.stringify(requestBody);
  }
  
  if (serverOptions.method === 'DELETE') {
    eyes.inspect(serverOptions);
  }

  request(serverOptions, function (err, res, body) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }
    
    var statusCode = res.statusCode.toString();
    if (Object.keys(failCodes).indexOf(statusCode) !== -1) {
      callback(new Error('Rackspace Error (' + statusCode + '): ' + failCodes[statusCode]));
      return;
    }

    completed(body, res);
  });
};

var contentTypeOptions = '-i -H "Content-Type: application/json" ';
var authTokenOptions = '-i -H "X-AUTH-TOKEN:{{auth-token}}" ';
var curlOptions = '-X "{{method}}" {{uri}}';

utils.rackspaceCurl = function (method, uri, completed, callback) {
  var options = 'curl ', error = '', data = '';
  
  if (method === 'POST') {
    options += contentTypeOptions;
  }
  
  options += authTokenOptions.replace('{{auth-token}}', cloudservers.config.authToken);
  options += curlOptions.replace('{{method}}', method).replace('{{uri}}', uri);
  //var commands = options.split(' ');
  
  eyes.inspect(options);
  //eyes.inspect(commands);
  
  var child = exec(options, function (error, stdout, stderr) {
    eyes.inspect(stdout);
    eyes.inspect(stderr);
  });
  
  /*var curl = spawn('curl', commands);
  
  curl.stdout.setEncoding('ascii');
  curl.stderr.setEncoding('ascii');  

  curl.stderr.addListener('data', function (chunk) {
    error += chunk;
  });

  curl.stdout.addListener('data', function (chunk) {
    data += chunk;
  });
  
  curl.addListener('exit', function (code, signal) {
    eyes.inspect(data);
  });*/
};