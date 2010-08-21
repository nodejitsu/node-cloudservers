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
    sys = require('sys'),
    utils = require('./utils');
 
var CloudServer = function (details) {
  if (!details) {
    throw new Error("CloudServer must be constructed with at least basic details.")
  }
  
  this._setProperties(details);
};

//
// Helper method for performing 'Server Actions' to /servers/:id/action
// e.g. Reboot, Rebuild, Resize, Confirm Resize, Revert Resize
//
var serverAction = function(body, callback) {
  var confirmOptions = {
    method: 'POST',
    uri: utils.serverUrl('servers', this.id, 'action'),
    body: body
  };
  
  utils.rackspace(confirmOptions, callback, function (body) {
    callback(new Error('This method is not working as expected'));
  })
};

CloudServer.prototype = {
  //
  // Confirms that the newly resized server for this instance
  // is working correctly. Removes the previous server at 
  // Rackspace and it cannot be rolled back to. 
  // Parameters: callback
  //
  // Remark: This doesn't work!
  confirmResize: function (callback) {
    serverAction({ 'confirmResize': null }, callback);
  },
  
  //
  // Deletes this instance from the Rackspace CloudServers system.
  // Parameters: callback
  //
  destroy: function (callback) {
    utils.rackspaceCurl('DELETE', utils.serverUrl('servers', this.id), callback, function (body, response) {
      eyes.inspect(body);
      eyes.inspect(response.statusCode);
      callback(null, response);
    });
  },
  
  //
  // Disables the backup schedule for this instance.
  // Parameters: callback
  //
  // Remark: This doesn't work!
  disableBackup: function (callback) {
    utils.rackspace('DELETE', utils.serverUrl('servers', this.id, 'backup_schedule'), callback, function (body, res) {
      callback(new Error('This method is not working as expected.'));
    });
  },
  
  //
  // Updates the addresses for this instance
  // Parameters: type['public' || 'private]? callback
  //
  getAddresses: function () {
    var type = '', callback;
        
    if(typeof arguments[0] === 'function') {
      callback = arguments[0];
    }
    else {
      type = arguments[0];
      callback = arguments[1];
    }
    
    var self = this;
    utils.rackspace(utils.serverUrl('servers', this.id, 'ips', type), callback, function (body) {
      var parsed = JSON.parse(body);
      
      if(type === '') {
        self.addresses = parsed.addresses;
      }
      else {
        self.addresses = self.addresses || {};
        self.addresses[type] = parsed[type];
      }
      
      callback(null, self.addresses);
    });
  },
  
  //
  // Gets the backup schedule for this instance
  // Parameters: callback
  //
  getBackup: function (callback) {
    utils.rackspace(utils.serverUrl('servers', this.id, 'backup_schedule'), callback, function (body) {
      this.backups = JSON.parse(body).backupSchedule;
      callback(null, this.backups);
    });
  },
  
  //
  // Gets details for this instance
  // Parameters: callback
  //
  getDetails: function (callback) {
    var self = this;
    cloudservers.getServer(this.id, function (err, server) {
      if (err) {
        callback(err);
        return;
      }
      
      self._setProperties(server);
      callback(null, self);
    });
  },
  
  //
  // Reboots this instance with either a 'soft' or 'hard' reboot
  // Parameters: type['soft' || 'hard']? callback
  //
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
  
  //
  // Rebuilds this instance with the specified image. This 
  // will delete all data on the server instance. The 'image' can
  // be an instance of a node-cloudservers Image or an image id.
  // Parameters: image callback
  //
  // Remark: This doesn't work!
  rebuild: function (image, callback) {
    var imageId = image instanceof cloudservers.Image ? image.id : image;
    serverAction({ 'rebuild': { 'imageId': imageId } }, callback);
  },
  
  //
  // Resizes this instance to another flavor. In essence scaling the server up 
  // or down. The original server is saved for a period of time to rollback if
  // there is a problem. The 'flavor' can be an instance of a node-cloudservers 
  // Flavor or a flavor id.
  // Parameters: flavor callback
  // 
  // Remark: This doesn't work!
  resize: function (flavor, callback) {
    var flavorId = flavor instanceof cloudservers.Flavor ? flavor.id : flavor;
    serverAction({ 'resize': { 'flavorId': flavorId } }, callback);
  },
  
  //
  // Rolls back this instance to a previously saved server during a resize.
  // Parameters: callback
  //
  // Remark: This doesn't work!
  revertResize: function (callback) {
    serverAction({ 'revertResize': null }, callback);
  },
  
  //
  // Updates the server name / password for this instance
  // Parameters: name pass callback
  //
  // Remark: This doesn't work!
  update: function (name, pass, callback) {
    var updateOptions = {
      method: 'PUT',
      uri: utils.serverUrl('servers', this.id),
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
  
  //
  // Updates the backup schedule for this instance.
  // Parameters: backup callback
  //
  updateBackup: function (backup, callback) { 
    var updateOptions = {
      method: 'POST',
      uri: utils.serverUrl('servers', this.id, 'backup_schedule'),
      body: {
        "backupSchedule": backup
      }
    };
    
    utils.rackspace(updateOptions, callback, function (body, res) {
      callback(null, res);
    });
  },
  
  //
  // Continually polls Rackspace CloudServers and checks the
  // results against the attributes parameter. When the attributes
  // match the callback will be fired. 
  // Parameters: attributes callback
  //
  setWait: function (attributes, interval, callback) {
    var self = this;
    var equalCheckId = setInterval(function () {
      self.getDetails(function (err, server) {
        if (err) {
          clearInterval(equalCheckId);
          callback(err);
          return;
        }
        
        var equal = true, keys = Object.keys(attributes);
        for (index in keys) {
          if(attributes[keys[index]] !== server[keys[index]]) {
            equal = false;
            break;
          }
        }
        
        if (equal) {
          clearInterval(equalCheckId);
          callback(null, self);
        }
      });
    }, interval);
    
    return equalCheckId;
  },
  
  //
  // Clears a previously setWait for this instance
  // Parameters: intervalId
  //
  clearWait: function (intervalId) {
    clearInterval(intervalId);
  },
  
  //
  // Sets the properties for this instance
  // Parameters: details
  //
  _setProperties: function (details) {
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
  }
};

exports.Server = CloudServer;