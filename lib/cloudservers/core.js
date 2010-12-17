/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..'));
 
var http = require('http'),
    url = require('url'),
    request = require('request'),
    cloudservers = require('cloudservers'),
    utils = require('./utils');
    
var authUrl = 'auth.api.rackspacecloud.com',
    serverUrl = 'servers.api.rackspacecloud.com';

exports.createClient = function (options) {
  return new Client(options);
};

var Client = exports.Client = function(options) {
 if (!options.auth) throw new Error ('options.auth is required to create Config');
 
 this.config = options;
 this.authorized = false; 
};

//
// Authenticates node-cloudservers with the specified options:
// { username: "your-username", apiKey: "your-secret-key" }
//
Client.prototype.setAuth = function (options, callback) {
  self = this;
  var authOptions = {
    uri: 'https://' + authUrl + '/v1.0', 
    headers: {
      'HOST': authUrl,
      'X-AUTH-USER': this.config.auth.username,
      'X-AUTH-KEY': this.config.auth.apiKey
    }
  };
  
  request(authOptions, function (err, res, body) {
    if (err) return callback(err); 
    
    self.authorized = true;
    self.config.serverUrl = res.headers['x-server-management-url'];
    self.config.storageUrl = res.headers['x-storage-url'];
    self.config.cdnUrl = res.headers['x-cdn-management-url'];
    self.config.authToken = res.headers['x-auth-token'];
    
    callback(null, res);
  });
};

//
// Gets the version of the Rackspace CloudServers API we are running against
// Parameters: callback
//
Client.prototype.getVersion = function (callback) {
  var versionOptions = {
    uri: 'https://' + serverUrl,
  };
  
  request(versionOptions, function (err, res, body) {
    callback(null, JSON.parse(body).versions);
  });
};

//
// Gets the current API limits when authenticated. 
// Parameters: callback
//
Client.prototype.getLimits = function (callback) {
 utils.rackspace(this.serverUrl('limits'), this, callback, function (body) {
   callback(null, JSON.parse(body).limits);
 });
};

//
// Gets all servers for the authenticated username / apikey.
// Parameters: details? callback
//
Client.prototype.getServers = function () {
  var self = this, details = false, callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var serverPath = details ? 'servers/detail.json' : 'servers.json';
  utils.rackspace(this.serverUrl(serverPath), this, callback, function (body) {
    var serversInfo = JSON.parse(body), results = [];
    serversInfo.servers.forEach(function (info) {
      results.push(new (cloudservers.Server)(self, info));
    });
    
    callback(null, results);
  });
};

//
// Gets the details for the server with the specified id. 
// Parameters: id callback
//
Client.prototype.getServer = function (id, callback) {
  var self = this;
  utils.rackspace(this.serverUrl('servers', id), this, callback, function (body) {
    callback(null, new (cloudservers.Server)(self, JSON.parse(body).server));
  });
};

//
// Creates a server with the specified options. The flavor / image
// properties of the options can be instances of node-cloudserver's 
// objects (Flavor, Image) OR ids to those entities in Rackspace.
// Parameters: options callback
//
Client.prototype.createServer = function (options, callback) {
  var self = this, flavorId, imageId;
  
  ['flavor', 'image', 'name'].forEach(function (required) {
    if(!options[required]) throw new Error('options.' + required + ' is a required argument.');
  });
  
  flavorId = options['flavor'] instanceof cloudservers.Flavor ? options['flavor'].id : options['flavor'];
  imageId  = options['image'] instanceof cloudservers.Image   ? options['image'].id  : options['image'];
  
  // Remark: We should do something fancy for personality
  // like reading all the files in via fs.readFile, etc.
  var createOptions = {
    method: 'POST',
    uri: this.serverUrl('servers'),
    client: this,
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
    var server = new (cloudservers.Server)(self, JSON.parse(body).server);
    callback(null, server);
  });
};

Client.prototype.destroyServer = function (server, callback) {
  var serverId = server instanceof cloudservers.Server ? server.id, server;
  utils.rackspaceCurl('DELETE', this.serverUrl('servers', serverId), this, callback, function (body, response) {
    callback(null, response);
  });
}

//
// Gets all flavors (i.e. size configurations) for the authenticated username / apikey.
// Parameters: details? callback
//
Client.prototype.getFlavors = function() {
  var self = this, details = false, callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var flavorPath = details ? 'flavors/detail.json' : 'flavors.json';
  utils.rackspace(this.serverUrl(flavorPath), this, callback, function (body) {
    var flavorInfo = JSON.parse(body), results = [];
    flavorInfo.flavors.forEach(function (info) {
      results.push(new (cloudservers.Flavor)(self, info));
    });
    
    callback(null, results);
  });
};

//
// Gets the details for the flavor specified by id.
// Parameters: id callback
//
Client.prototype.getFlavor = function (id, callback) {
  var self = this;
  utils.rackspace(this.serverUrl('flavors', id), this, callback, function (body) {
    callback(null, new (cloudservers.Flavor)(self, JSON.parse(body).flavor));
  });
};

//
// Gets all images (rackspace or custom by username) for the authenticated username / apikey.
// Parameters: details? callback
//
Client.prototype.getImages = function () {
  var self = this, details = false, callback;
  
  if(typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }
  
  var imagePath = details ? 'images/detail.json' : 'images.json';
  utils.rackspace(self.serverUrl(imagePath), this, callback, function (body) {
    var imageInfo = JSON.parse(body), results = [];
    imageInfo.images.forEach(function (info) {
      results.push(new (cloudservers.Image)(self, info));
    });
    
    callback(null, results);
  });
};

//
// Gets the details for the image specified by id.
// Parameters: id callback
//
Client.prototype.getImage = function (id, callback) {
  var self = this;
  utils.rackspace(this.serverUrl('images', id), this, callback, function (body) {
    callback(null, new (cloudservers.Image)(self, JSON.parse(body).image));
  });
};

//
// Creates a new image from the specified server with the given name.
// Server can be an instance of a node-cloudservers Server or a server id.
// Parameters: name server callback
//
// Remark: Not Working!
Client.prototype.createImage = function (name, server, callback) {
  var self = this, serverId = server instanceof cloudservers.Server ? server.id : server;
  
  var createOptions = {
    method: 'POST',
    uri: this.serverUrl('images'),
    client: self, 
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

//
// Helper method that concats the string params into a url
// to request against the authenticated node-cloudservers
// serverUrl. 
//
Client.prototype.serverUrl = function () {
  var args = args = Array.prototype.slice.call(arguments);
  return [this.config.serverUrl].concat(args).join('/');
};