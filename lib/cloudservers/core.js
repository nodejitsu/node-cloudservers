/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var http = require('http'),
    url = require('url'),
    request = require('request'),
    utils = require('./utils');
    
require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers');

var core = exports;

var authUrl = 'auth.api.rackspacecloud.com';
var serverUrl = 'servers.api.rackspacecloud.com';

//
// Authenticates node-cloudservers with the specified options:
// { username: "your-username", apiKey: "your-secret-key" }
//
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

//
// Gets the version of the Rackspace CloudServers API we are running against
// Parameters: callback
//
core.getVersion = function (callback) {
  var versionOptions = {
    uri: 'https://' + serverUrl
  };
  
  request(versionOptions, function (err, res, body) {
    callback(null, JSON.parse(body).versions);
  });
};

//
// Gets the current API limits when authenticated. 
// Parameters: callback
//
core.getLimits = function (callback) {
 utils.rackspace(utils.serverUrl('limits'), callback, function (body) {
   callback(null, JSON.parse(body).limits);
 });
};

//
// Gets all servers for the authenticated username / apikey.
// Parameters: details? callback
//
core.getServers = function () {
  var details = false, callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var serverPath = details ? 'servers/detail.json' : 'servers.json';
  
  utils.rackspace(utils.serverUrl(serverPath), callback, function (body) {
    var serversInfo = JSON.parse(body);
    var results = [];
    serversInfo.servers.forEach(function (info) {
      results.push(new (cloudservers.Server)(info));
    });
    
    callback(null, results);
  });
};

//
// Gets the details for the server with the specified id. 
// Parameters: id callback
//
core.getServer = function (id, callback) {
  utils.rackspace(utils.serverUrl('servers', id), callback, function (body) {
    callback(null, new (cloudservers.Server)(JSON.parse(body).server));
  });
};

//
// Creates a server with the specified options. The flavor / image
// properties of the options can be instances of node-cloudserver's 
// objects (Flavor, Image) OR ids to those entities in Rackspace.
// Parameters: options callback
//
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
    uri: utils.serverUrl('servers'),
    body: {
      server: {
        name: options['name'],
        imageId: imageId,
        flavorId: flavorId,
        metadata: options['metadata'],
        personality: options['personality'] || []
      }
    }
  };
  
  utils.rackspace(createOptions, callback, function (body, response) {
    try {
      var server = new (cloudservers.Server)(JSON.parse(body).server);
      callback(null, server);
    }
    catch (err) {
      // TODO: Parse the fault that we get back from cloudservers
      callback(new Error(err));
    }
  });
};

//
// Gets all flavors (i.e. size configurations) for the authenticated username / apikey.
// Parameters: details? callback
//
core.getFlavors = function() {
  var details = false, callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var flavorPath = details ? 'flavors/detail.json' : 'flavors.json';
  
  utils.rackspace(utils.serverUrl(flavorPath), callback, function (body) {
    var flavorInfo = JSON.parse(body);
    var results = [];
    flavorInfo.flavors.forEach(function (info) {
      results.push(new (cloudservers.Flavor)(info));
    });
    
    callback(null, results);
  });
};

//
// Gets the details for the flavor specified by id.
// Parameters: id callback
//
core.getFlavor = function (id, callback) {
  utils.rackspace(utils.serverUrl('flavors', id), callback, function (body) {
    callback(null, new (cloudservers.Flavor)(JSON.parse(body).flavor));
  });
};

//
// Gets all images (rackspace or custom by username) for the authenticated username / apikey.
// Parameters: details? callback
//
core.getImages = function () {
  var details = false, callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var imagePath = details ? 'images/detail.json' : 'images.json';
  
  utils.rackspace(utils.serverUrl(imagePath), callback, function (body) {
    var imageInfo = JSON.parse(body);
    var results = [];
    imageInfo.images.forEach(function (info) {
      results.push(new (cloudservers.Image)(info));
    });
    
    callback(null, results);
  });
};

//
// Gets the details for the image specified by id.
// Parameters: id callback
//
core.getImage = function (id, callback) {
  utils.rackspace(utils.serverUrl('images', id), callback, function (body) {
    callback(null, new (cloudservers.Image)(JSON.parse(body).image));
  });
};

//
// Creates a new image from the specified server with the given name.
// Server can be an instance of a node-cloudservers Server or a server id.
// Parameters: name server callback
//
// Remark: Not Working!
core.createImage = function (name, server, callback) {
  var serverId = server = server instanceof cloudservers.Server ? server.id : server;
  
  var createOptions = {
    method: 'POST',
    uri: utils.serverUrl('images'),
    body: {
      image: {
        name: name,
        serverId: serverId
      }
    }
  };
  
  utils.rackspace(createOptions, callback, function (body) {
    callback(new Error('This method isnt working as expected'));
  });
};