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
    utils = require('./utils');
    
require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers');

var core = exports;

var authUrl = 'auth.api.rackspacecloud.com';
var serverUrl = 'servers.api.rackspacecloud.com';

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

core.getVersion = function (callback) {
  var versionOptions = {
    uri: 'https://' + serverUrl
  };
  
  request(versionOptions, function (err, res, body) {
    callback(null, JSON.parse(body).versions);
  });
};

core.getLimits = function (callback) {
 utils.rackspace(cloudservers.config.serverUrl.href + '/limits', callback, function (body) {
   callback(null, JSON.parse(body).limits);
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
  
  utils.rackspace(cloudservers.config.serverUrl.href + serverPath, callback, function (body) {
    var serversInfo = JSON.parse(body);
    var results = [];
    serversInfo.servers.forEach(function (info) {
      results.push(new (cloudservers.Server)(info));
    });
    
    callback(null, results);
  });
};

core.getServer = function (id, callback) {
  utils.rackspace(cloudservers.config.serverUrl.href + '/servers/' + id, callback, function (body) {
    callback(null, new (cloudservers.Server)(JSON.parse(body).server));
  });
};

// Remark: Not working!
core.createServer = function (options, callback) {
  var flavorId,
      imageId;
  
  ['flavor', 'image', 'name'].forEach(function (required) {
    if(!options[required]) {
      throw new Error('options.' + required + ' is a required argument.');
    }
  });
  
  flavorId = options['flavor'] instanceof cloudservers.Flavor ? options['flavor'].id : options['flavor'];
  imageId  = options['image'] instanceof cloudservers.Image   ? options['image'].id  : options['image'];
  
  // Remark: We should do something fancy for personality
  // like reading all the files in via fs.readFile, etc.
  var createOptions = {
    method: 'POST',
    uri: cloudservers.config.serverUrl.href + '/servers',
    body: {
      server: {
        name: options['name'],
        imageId: imageId,
        flavorId: flavorId,
        metadata: options['metadata']
      }
    }
  };
  
  //eyes.inspect(createOptions);
  
  utils.rackspace(createOptions, function (body, response) {
    //eyes.inspect(body);
    //eyes.inspect(response.statusCode);
    
    callback(new Error('This method isnt working as expected'));
    
    // TODO: Get this working...
    //callback(null, new (cloudservers.Server)(JSON.parse(body).server));
  });
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
  
  utils.rackspace(cloudservers.config.serverUrl.href + flavorPath, callback, function (body) {
    var flavorInfo = JSON.parse(body);
    var results = [];
    flavorInfo.flavors.forEach(function (info) {
      results.push(new (cloudservers.Flavor)(info));
    });
    
    callback(null, results);
  });
};

core.getFlavor = function (id, callback) {
  utils.rackspace(cloudservers.config.serverUrl.href + '/flavors/' + id, callback, function (body) {
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
  
  utils.rackspace(cloudservers.config.serverUrl.href + imagePath, callback, function (body) {
    var imageInfo = JSON.parse(body);
    var results = [];
    imageInfo.images.forEach(function (info) {
      results.push(new (cloudservers.Image)(info));
    });
    
    callback(null, results);
  });
};

core.getImage = function (id, callback) {
  utils.rackspace(cloudservers.config.serverUrl.href + '/images/' + id, callback, function (body) {
    callback(null, new (cloudservers.Image)(JSON.parse(body).image));
  });
};

// Remark: Not Working!
core.createImage = function (name, server, callback) {
  var serverId = server = server instanceof cloudservers.Server ? server.id : server;
  
  var createOptions = {
    method: 'POST',
    uri: cloudservers.config.serverUrl.href + '/images',
    body: {
      image: {
        name: name,
        serverId: serverId
      }
    }
  };
  
  utils.rackspace(createOptions, callback, function (body) {
    //eyes.inspect(body);
    callback(new Error('This method isnt working as expected'));
  });
};