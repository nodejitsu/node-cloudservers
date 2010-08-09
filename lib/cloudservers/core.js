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

var rackspace = function (uri, callback, completed) {
  var serverOptions = {
    uri: uri,
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
    
    completed(body);
  });
}

core.setAuth = function (options, callback) {
  var authOptions = {
    uri: 'https://' + authUrl + '/v1.0', 
    headers: {
      'HOST': authUrl,
      'X-AUTH-USER': options.username,
      'X-AUTH-KEY': options.apiKey
    }
  };
  
  request(authOptions, function (err, res, body) {
    if (err) {
      callback(err); 
      return;
    }
    
    cloudservers.config.serverUrl = res.headers['x-server-management-url'];
    cloudservers.config.storageUrl = res.headers['x-storage-url'];
    cloudservers.config.cdnUrl = res.headers['x-cdn-management-url'];
    cloudservers.config.authToken = res.headers['x-auth-token'];
    
    callback(null, res);
  });
};

core.getServers = function () {
  var serverUrl = cloudservers.config.serverUrl,
      details = false,
      callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var serverPath = details ? '/servers/detail.json' : '/servers.json';
  
  rackspace(cloudservers.config.serverUrl.href + serverPath, callback, function (body) {
    var serversInfo = JSON.parse(body);
    var results = [];
    serversInfo.servers.forEach(function (info) {
      results.push(new (cloudservers.Server)(info));
    });
    
    callback(null, results);
  });
};

core.getServer = function (id, callback) {
  rackspace(cloudservers.config.serverUrl.href + '/servers/' + id, callback, function (body) {
    callback(null, new (cloudservers.Server)(JSON.parse(body).server));
  });
};

core.createServer = function (callback) {
  
};

core.getFlavors = function() {
  var serverUrl = cloudservers.config.serverUrl,
      details = false,
      callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var flavorPath = details ? '/flavors/detail.json' : '/flavors.json';
  
  rackspace(cloudservers.config.serverUrl.href + flavorPath, callback, function (body) {
    var flavorInfo = JSON.parse(body);
    var results = [];
    flavorInfo.flavors.forEach(function (info) {
      results.push(new (cloudservers.Flavor)(info));
    });
    
    callback(null, results);
  });
};

core.getFlavor = function (id, callback) {
  rackspace(cloudservers.config.serverUrl.href + '/flavors/' + id, callback, function (body) {
    callback(null, new (cloudservers.Flavor)(JSON.parse(body).flavor));
  });
};

core.getImages = function () {
  var details = false,
      callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var imagePath = details ? '/images/detail.json' : '/images.json';
  
  rackspace(cloudservers.config.serverUrl.href + imagePath, callback, function (body) {
    var imageInfo = JSON.parse(body);
    var results = [];
    imageInfo.images.forEach(function (info) {
      results.push(new (cloudservers.Image)(info));
    });
    
    callback(null, results);
  });
};

core.getImage = function (id, callback) {
  rackspace(cloudservers.config.serverUrl.href + '/images/' + id, callback, function (body) {
    callback(null, new (cloudservers.Image)(JSON.parse(body).image));
  });
};

core.createImage = function () {
  
};