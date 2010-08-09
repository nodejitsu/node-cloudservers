/*
 * cloud-server.js: Instance of a single rackspace cloudserver
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers');
 
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

CloudServer.prototype = {
  //
  // Gets details for this instance
  //
  getDetails: function (callback) {
    cloudservers.getServer(this.id, callback);
  },
  
  //
  // Updates the server name / password for this instance
  //
  update: function (name, pass, callback) {
    
  },
  
  //
  // Deletes this instance from the Rackspace system
  //
  remove: function (callback) {
    
  },
  
  reboot: function (callback) {
    
  },
  
  rebuild: function (callback) {
    
  },
  
  resize: function (callback) {
    
  },
  
  confirmResize: function (callback) {
    
  },
  
  revertResize: function (callback) {
    
  }
};

exports.Server = CloudServer;