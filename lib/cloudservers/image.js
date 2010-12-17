/*
 * cloud-server.js: Instance of a single rackspace cloudserver
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var utils = require('./utils');

var Image = exports.Image =  function (client, details) {
  if (!details) throw new Error("Image must be constructed with at least basic details.")

  this.client = client;
  this._setProperties(details);
}

Image.prototype = {
  //
  // Deletes this instance from the Rackspace system
  //
  // Remark: This doesn't work!
  destroy: function (callback) {
    // TODO: This should be defined as cloudservers.Client.destoryImage
    utils.rackspace('DELETE', client.serverUrl('images', this.id), client, callback, function (body) {
      callback(new Error('This method is not working as expected'));
    });
  },
  
  //
  // Gets details for this instance
  //
  getDetails: function (callback) {
    var self = this;
    client.getImage(this.id, function (err, image) {
      if (err) return callback(err);

      self._setProperties(image);
      callback(null, self);
    });
  },
  
  //
  // Sets the properties for this instance
  // Parameters: details
  //
  _setProperties: function (details) {
    this.id = details.id;
    this.name = details.name;
    this.updated = details.updated;
    this.created = details.created;
    this.status = details.status;
    this.progress = details.progress;
  }
};