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



vows.describe('node-cloudservers/servers').addBatch({
  "The node-cloudservers client": {
    "when authenticated": {
      topic: function () {
        cloudservers.setAuth(cloudservers.config, this.callback);
      },
      "should return with 201": function (err, res) {
        assert.equal(res.statusCode, 204);
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getServers() method": {
      topic: function () {
        cloudservers.getServers(this.callback);
      },
      "should return the list of servers": function () {
        
      }
    }
  }
}).export(module);