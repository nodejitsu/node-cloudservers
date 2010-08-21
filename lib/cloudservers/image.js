/*
 * cloud-server.js: Instance of a single rackspace cloudserver
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers'),
    utils = require('./utils');

var Image = function (details) {
  if (!details) {
    throw new Error("Image must be constructed with at least basic details.")
  }
  
  this._setProperties(details);
}

Image.prototype = {
  //
  // Deletes this instance from the Rackspace system
  //
  // Remark: This doesn't work!
  destroy: function (callback) {
    utils.rackspace('DELETE', utils.serverUrl('images', this.id), callback, function (body) {
      callback(new Error('This method is not working as expected'));
    });
  },
  
  //
  // Gets details for this instance
  //
  getDetails: function (callback) {
    var self = this;
    cloudservers.getImage(this.id, function (err, image) {
      if (err) {
        callback(err);
        return;
      }
      
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

exports.Image = Image;