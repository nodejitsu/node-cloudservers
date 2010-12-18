/*
 * flavor-test.js: Tests for rackspace cloudservers flavor requests
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

 var path = require('path'),
     vows = require('vows'),
     assert = require('assert'),
     helpers = require('./helpers');
     fs = require('fs');

 require.paths.unshift(path.join(__dirname, '..', 'lib'));

 var testData = {};
     cloudservers = require('cloudservers'),
     Client = helpers.createClient();
    
var testContext = {};

vows.describe('node-cloudservers/flavors').addBatch({
  "The node-cloudservers client": {
    "when authenticated": {
      topic: function () {
        var options = Client.config
        Client.setAuth(options.auth, this.callback);
      },
      "should return with 204": function (err, res) {
        assert.equal(res.statusCode, 204);
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getFlavors() method": {
      "with no details": {
        topic: function () {
          Client.getFlavors(this.callback);
        },
        "should return the list of flavors": function (err, flavors) {
          testContext.flavors = flavors;
          flavors.forEach(function (flavor) {
            helpers.assertFlavor(flavor);
          });
        }
      },
      "with details": {
        topic: function () {
          Client.getFlavors(true, this.callback);
        },
        "should return the list of flavors": function (err, flavors) {
          flavors.forEach(function (flavor) {
            helpers.assertFlavorDetails(flavor);
          });
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getFlavor() method": {
      topic: function () {
        Client.getFlavor(testContext.flavors[0].id, this.callback);
      },
      "should return a valid flavor": function (err, flavor) {
        helpers.assertFlavorDetails(flavor);
      }
    }
  }
}).export(module);