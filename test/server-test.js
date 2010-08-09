/*
 * server-test.js: Tests for rackspace cloudservers server requests
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var path = require('path'),
    vows = require('vows'),
    eyes = require('eyes'),
    assert = require('assert');
    
require.paths.unshift(path.join(__dirname, '..', 'lib'));

var cloudservers = require('cloudservers');

var testContext = {};

var assertServer = function (server) {
  assert.instanceOf(server, cloudservers.Server);
  assert.isNotNull(server.id);
  assert.isNotNull(server.name);
};

var assertServerDetails = function (server) {
  assertServer(server);
  assert.isNotNull(server.progess);
  assert.isNotNull(server.imageId);
  assert.isNotNull(server.flavorId);
  assert.isNotNull(server.status);
  assert.isNotNull(server.hostId);
  assert.isNotNull(server.addresses);
};

vows.describe('node-cloudservers/servers').addBatch({
  "The node-cloudservers client": {
    "when authenticated": {
      topic: function () {
        var options = cloudservers.config
        cloudservers.setAuth(options.auth, this.callback);
      },
      "should return with 204": function (err, res) {
        assert.equal(res.statusCode, 204);
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getServers() method": {
      "with no details": {
        topic: function () {
          cloudservers.getServers(this.callback);
        },
        "should return the list of servers": function (err, servers) {
          testContext.servers = servers;
          servers.forEach(function (server) {
            assertServer(server);
          });
        }
      },
      "with details": {
        topic: function () {
          cloudservers.getServers(true, this.callback);
        },
        "should return the list of servers": function (err, servers) {
          servers.forEach(function (server) {
            assertServerDetails(server);
          });
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getServer() method": {
      topic: function () {
        cloudservers.getServer(testContext.servers[0].id, this.callback);
      },
      "should return a valid server": function (err, server) {
        assertServerDetails(server);
      }
    }
  }
}).export(module);