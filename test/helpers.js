/*
 * helpers.js: Test helpers for node-cloudservers
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var path = require('path'),
    vows = require('vows'),
    assert = require('assert');
    
require.paths.unshift(path.join(__dirname, '..', 'lib'));

var cloudservers = require('cloudservers');

var helpers = exports;

helpers.assertServer = function (server) {
  assert.instanceOf(server, cloudservers.Server);
  assert.isNotNull(server.id);
  assert.isNotNull(server.name);
};

helpers.assertServerDetails = function (server) {
  helpers.assertServer(server);
  assert.isNotNull(server.progess);
  assert.isNotNull(server.imageId);
  assert.isNotNull(server.flavorId);
  assert.isNotNull(server.status);
  assert.isNotNull(server.hostId);
  assert.isNotNull(server.addresses);
};

helpers.assertImage = function (image) {
  assert.instanceOf(image, cloudservers.Image);
  assert.isNotNull(image.id);
  assert.isNotNull(image.name);
};

helpers.assertImageDetails = function (image) {
  helpers.assertImage(image);
  assert.isNotNull(image.updated);
  assert.isNotNull(image.created);
  assert.isNotNull(image.status);
};

helpers.assertFlavor = function (flavor) {
  assert.instanceOf(flavor, cloudservers.Flavor);
  assert.isNotNull(flavor.id);
  assert.isNotNull(flavor.name);
};

helpers.assertFlavorDetails = function (flavor) {
  helpers.assertFlavor(flavor);
  assert.isNotNull(flavor.ram);
  assert.isNotNull(flavor.disk);
};
