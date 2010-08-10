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
    throw new Error("Image must be constructed with at-least basic details.")
  }
  
  this.id = details.id;
  this.name = details.name;
  this.updated = details.updated;
  this.created = details.created;
  this.status = details.status;
  this.progress = details.progress;
}

Image.prototype = {
  //
  // Gets details for this instance
  //
  getDetails: function (callback) {
    cloudservers.getImage(this.id, callback);
  },
  
  //
  // Deletes this instance from the Rackspace system
  //
  // Remark: This doesn't work!
  remove: function (callback) {
    utils.rackspace('DELETE', cloudservers.config.serverUrl.href + '/images/' + this.id, callback, function (body) {
      callback(new Error('This method is not working as expected'));
    });
  },
};

exports.Image = Image;