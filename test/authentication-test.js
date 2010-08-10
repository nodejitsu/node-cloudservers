/*
 * authentication-test.js: Tests for rackspace cloudservers authentication
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
    
vows.describe('node-cloudservers/authentication').addBatch({
  "The node-cloudservers client": {
    "should have core methods defined": function() {
      assert.isObject(cloudservers.config.auth);
      assert.include(cloudservers.config.auth, 'username');
      assert.include(cloudservers.config.auth, 'apiKey');
      
      assert.isFunction(cloudservers.setAuth);
      assert.isFunction(cloudservers.getServer);
      assert.isFunction(cloudservers.getServers);
      assert.isFunction(cloudservers.createServer);
    },
    "the getVersion() method": {
      topic: function () {
        cloudservers.getVersion(this.callback);
      },
      "should return the proper version": function (versions) {
        assert.isArray(versions);
        assert.isFalse(versions.length == 0);
      }
    },
    "with a valid username and api key": {
      topic: function () {
        var options = cloudservers.config;
        cloudservers.setAuth(options.auth, this.callback);
      },
      "should respond with 204 and appropriate headers": function (err, res) {
        assert.equal(res.statusCode, 204); 
        assert.isObject(res.headers);
        assert.include(res.headers, 'x-server-management-url');
        assert.include(res.headers, 'x-storage-url');
        assert.include(res.headers, 'x-cdn-management-url');
        assert.include(res.headers, 'x-auth-token');
      },
      "should update the config with appropriate urls": function (err, res) {
        var config = cloudservers.config;
        assert.equal(res.headers['x-server-management-url'], config.serverUrl.href);
        assert.equal(res.headers['x-storage-url'], config.storageUrl.href);
        assert.equal(res.headers['x-cdn-management-url'], config.cdnUrl.href);
        assert.equal(res.headers['x-auth-token'], config.authToken);
      }
    },
    "with an invalid username and api key": {
      topic: function () {
        var options = { 
          username: 'invalid-username', 
          apiKey: 'invalid-apikey'
        };
        
        cloudservers.setAuth(options, this.callback);
      },
      "should respond with 401": function (err, res) {
        assert.equal(res.statusCode, 401);
      }
    }
  }
}).export(module);