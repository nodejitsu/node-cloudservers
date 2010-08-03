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
      assert.isObject(cloudservers.config);
      assert.include(cloudservers.config, 'username');
      assert.include(cloudservers.config, 'apiKey');
      
      assert.isFunction(cloudservers.setAuth);
      assert.isFunction(cloudservers.getServer);
      assert.isFunction(cloudservers.getServers);
      assert.isFunction(cloudservers.createServer);
    },
    "with a valid username and api key": {
      topic: function () {
        var options = cloudservers.config;
        cloudservers.setAuth(options, this.callback);
      },
      "should respond with 201 and appropriate headers": function (err, res, body) {
        assert.equal(res.statusCode, 204); 
        assert.isObject(res.headers);
        assert.include(res.headers, 'x-server-management-url');
        assert.include(res.headers, 'x-storage-url');
        assert.include(res.headers, 'x-cdn-management-url');
        assert.include(res.headers, 'x-auth-token');
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