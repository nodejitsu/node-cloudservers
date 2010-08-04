/*
 * cloud-server.js: Instance of a single rackspace cloudserver
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var CloudServer = function (details) {
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
  getDetails: function (callback) {
    
  },
  
  update: function (name, pass, callback) {
    
  },
  
  remove: function (callback) {
    
  }
};

exports.Server = CloudServer;