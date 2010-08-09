/*
 * Flavor.js: Instance of a single rackspace cloudserver flavor
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..'));

var cloudservers = require('cloudservers');

var Flavor = function (details) {
  if (!details) {
    throw new Error("Flavor must be constructed with at-least basic details.")
  }
  
  this.id = details.id;
  this.name = details.name;
  this.ram = details.ram;
  this.disk = details.disk;
};

Flavor.prototype = {
  //
  // Gets details for this instance
  //
  getDetails: function (callback) {
    cloudservers.getFlavor(this.id, callback);
  }
};

exports.Flavor = Flavor;