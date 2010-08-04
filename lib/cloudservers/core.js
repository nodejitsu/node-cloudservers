/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var http = require('http'),
    url = require('url'),
    eyes = require('eyes'),
    request = require('request'),
    cloudservers = require('../cloudservers');
 
var core = exports;

var authUrl = 'auth.api.rackspacecloud.com';

core.setAuth = function (options, callback) {
  var authClient = http.createClient(443, authUrl, true);
  var authRequest = authClient.request('GET', '/v1.0', {
    'HOST': authUrl,
    'X-AUTH-USER': options.username,
    'X-AUTH-KEY': options.apiKey
  });
  
  authRequest.on('response', function (response) {
    response.setEncoding('utf8');
    
    cloudservers.config.serverUrl = response.headers['x-server-management-url'];
    cloudservers.config.storageUrl = response.headers['x-storage-url'];
    cloudservers.config.cdnUrl = response.headers['x-cdn-management-url'];
    cloudservers.config.authToken = response.headers['x-auth-token'];
    
    response.on("end", function (err, obj) {
      callback(err, response);
    });
  });
  
  authRequest.end();
};

core.getServers = function (callback) {
  // Remark: This is an ugly hack until I refactor config.js
  var parsedServer = url.parse(cloudservers.config.serverUrl);

  var serverClient = http.createClient(443, parsedServer.host, true);
  var serverRequest = serverClient.request('GET', parsedServer.pathname + '/servers/detail.json', {
    'X-AUTH-TOKEN': cloudservers.config.authToken,
    'Content-Type': 'application/json'
  });
  
  serverRequest.on('response', function (response) {
    response.setEncoding('utf8');
    var body = '';
    
    response.on('data', function (chunk) { 
      body += chunk;
    });
    
    response.on('end', function (err, obj) {
      if(err) {
        callback(err);
        return;
      }
      
      var serversInfo = JSON.parse(body);
      var results = [];
      serversInfo.servers.forEach(function (info) {
        results.push(new (cloudservers.Server)(info));
      });
      
      callback(null, results);
    });
  });
  
  serverRequest.end();

  /*var getRequest = {
    uri: 'https://' + parsedServer.host,
    pathname: parsedServer.pathname + '/servers.json',
    headers: {
      'X-AUTH-TOKEN': cloudservers.config.authToken,
      'Content-Type': 'application/json'
    }
  };

  // Inspecting the request shows that I'm sending the right
  // headers and requesting the correct path.
  eyes.inspect(getRequest);
  
  request(getRequest, function (err, response, body) {
    // Remark: Right now this is returning 200, but no data. 
    // Just this: '{"versions":[{"id":"v1.0","status":"BETA"}]}'
    //eyes.inspect(err);
    //eyes.inspect(response.statusCode);
    eyes.inspect(body);
    
    callback(err, response);
  })*/
};

core.getServer = function (id, callback) {
  
};

core.createServer = function (callback) {
  
};