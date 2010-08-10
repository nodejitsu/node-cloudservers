/*
 * server-details-test.js: Tests for rackspace cloudservers server detailed requests
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var path = require('path'),
    vows = require('vows'),
    eyes = require('eyes'),
    helpers = require('./helpers'),
    assert = require('assert');
    
require.paths.unshift(path.join(__dirname, '..', 'lib'));

var cloudservers = require('cloudservers');

var testContext = {};

vows.describe('node-cloudservers/servers/details').addBatch({
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
            helpers.assertServer(server);
          });
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "an instance of a CloudServer": {
      "the getAddresses() method": {
        "when requesting all addresses": {
          topic: function () {
            this.server = testContext.servers[0];
            this.server.getAddresses(this.callback);
          },
          "should return all valid addresses": function (addresses) {
            assert.include(addresses, 'public');
            assert.include(addresses, 'private');
            assert.include(this.server.addresses, 'public');
            assert.include(this.server.addresses, 'private');
          }
        },
        "when requesting public addresses": {
          topic: function (server) {
            this.server = testContext.servers[1];
            this.server.getAddresses('public', this.callback);
          },
          "should return all valid addresses": function (addresses) {
            assert.include(addresses, 'public');
            assert.isUndefined(addresses.private);
            assert.include(this.server.addresses, 'public');
            assert.isUndefined(this.server.addresses.private);
          }
        },
        "when requesting private addresses": {
          topic: function (server) {
            this.server = testContext.servers[2];
            this.server.getAddresses('private', this.callback);
          },
          "should return all valid addresses": function (addresses) {
            assert.include(addresses, 'private');
            assert.isUndefined(addresses.public);
            assert.include(this.server.addresses, 'private');
            assert.isUndefined(this.server.addresses.public);
          }
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "an instance of a CloudServer": {
      "the getBackups() method": {
        topic: function () {
          this.server = testContext.servers[0];
          this.server.getBackups(this.callback);
        },
        "should return a valid backup schedule": function (backups) {
          assert.isNotNull(backups);
        }
      }
    }
  }
}).export(module);