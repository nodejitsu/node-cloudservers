/*
 * helpers.js: Test helpers for node-cloudservers
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', 'lib'));
 
var path = require('path'),
    vows = require('vows'),
    util = require('util'),
    fs = require('fs'),
    assert = require('assert'),
    cloudservers = require('cloudservers');
    
var testConfig, client, helpers = exports;

helpers.createClient = function () {
  if (!testConfig) helpers.loadConfig();
  if (!client) client = cloudservers.createClient(testConfig);
  
  return client;
};

helpers.loadConfig = function () {
  var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'test-config.json')).toString());
  if (config.auth.username === 'test-username'
      || config.auth.apiKey === 'test-apiKey') {
    util.puts('Config file test-config.json must be updated with valid data before running tests');
    process.exit(0);
  }
  
  testConfig = config;
  return config;
};

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
