/*
 * cloud-server.js: Instance of a single rackspace cloudserver
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers'),
    eyes = require('eyes'),
    utils = require('./utils');
 
var CloudServer = function (details) {
  if (!details) {
    throw new Error("CloudServer must be constructed with at-least basic details.")
  }
  
  // Set core properties
  this.id = details.id;
  this.name = details.name;
  
  // Set extra properties
  this.progress = details.progress;
  this.imageId = details.imageId;
  this.flavorId = details.flavorId;
  this.status = details.status;
  this.hostId = details.hostId;
  this.addresses = details.addresses || {};
  this.metadata = details.metadata || {};
};

var serverAction = function(body, callback) {
  var confirmOptions = {
    method: 'POST',
    uri: cloudservers.config.serverUrl.href + '/servers/' + this.id + '/action',
    body: body
  };
  
  utils.rackspace(confirmOptions, callback, function (body) {
    callback(new Error('This method is not working as expected'));
  })
};

CloudServer.prototype = {
  // Remark: This doesn't work!
  confirmResize: function (callback) {
    serverAction({ 'confirmResize': null }, callback);
  },
  
  // Remark: This doesn't work!
  disableBackup: function (callback) {
    utils.rackspace('DELETE', cloudservers.config.serverUrl.href + '/servers/' + this.id + '/backup_schedule', callback, function (body, res) {
      callback(new Error('This method is not working as expected.'));
    });
  },
  
  getAddresses: function () {
    var type = 'all',
        typeUrl = '/ips',
        callback;
        
    if(typeof arguments[0] === 'function') {
      callback = arguments[0];
    }
    else {
      type = arguments[0];
      callback = arguments[1];
    }
    
    typeUrl += type !== 'all' ? '/' + type : '';
    
    var self = this;
    utils.rackspace(cloudservers.config.serverUrl.href + '/servers/' + this.id + typeUrl, callback, function (body) {
      var parsed = JSON.parse(body);
      
      if(type === 'all') {
        self.addresses = parsed.addresses;
      }
      else {
        self.addresses = self.addresses || {};
        self.addresses[type] = parsed[type];
      }
      
      callback(null, self.addresses);
    });
  },
  
  getBackup: function (callback) {
    utils.rackspace(cloudservers.config.serverUrl.href + '/servers/' + this.id + '/backup_schedule', callback, function (body) {
      this.backups = JSON.parse(body).backupSchedule;
      callback(null, this.backups);
    });
  },
  
  //
  // Gets details for this instance
  //
  getDetails: function (callback) {
    cloudservers.getServer(this.id, callback);
  },
  
  //
  // Deletes this instance from the Rackspace system
  //
  // Remark: This doesn't work!
  remove: function (callback) {
    utils.rackspace('DELETE', cloudservers.config.serverUrl.href + '/servers/' + this.id, callback, function (body) {
      callback(new Error('This method is not working as expected'));
    });
  },
  
  // Remark: This doesn't work!
  reboot: function () {
    var type = 'soft', 
        callback;
    
    if(typeof arguments[0] === 'function') {
      callback = arguments[0];
    }
    else {
      type = arguments[0];
      callback = arguments[1];
    }
    
    serverAction({ 'reboot': { 'type': type } }, callback);
  },
  
  // Remark: This doesn't work!
  rebuild: function (image, callback) {
    var imageId = image instanceof cloudservers.Image ? image.id : image;
    serverAction({ 'rebuild': { 'imageId': imageId } }, callback);
  },
  
  // Remark: This doesn't work!
  resize: function (flavor, callback) {
    var flavorId = flavor instanceof cloudservers.Flavor ? flavor.id : flavor;
    serverAction({ 'resize': { 'flavorId': flavorId } }, callback);
  },
  
  // Remark: This doesn't work!
  revertResize: function (callback) {
    serverAction({ 'revertResize': null }, callback);
  },
  
  //
  // Updates the server name / password for this instance
  //
  // Remark: This doesn't work!
  update: function (name, pass, callback) {
    var updateOptions = {
      method: 'PUT',
      uri: cloudservers.config.serverUrl.href + '/servers/' + this.id,
      body: {
        'server': {
          'name': name,
          'adminPass': pass
        }
      }
    };
    
    utils.rackspace(updateOptions, callback, function (body) {
      callback(new Error('This method is not working as expected'));
    });
  },
  
  // Remark: This doesn't work!
  updateBackup: function (backup, callback) { 
    var updateOptions = {
      method: 'POST',
      uri: cloudservers.config.serverUrl.href + '/servers/' + this.id + '/backup_schedule',
      body: {
        "backupSchedule": backup
      }
    };
    
    utils.rackspace(updateOptions, callback, function (body, res) {
      callback(new Error('This method isnt working as expected'));
    });
  }
};

exports.Server = CloudServer;