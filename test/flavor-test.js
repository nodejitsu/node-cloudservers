/*
 * flavor-test.js: Tests for rackspace cloudservers flavor requests
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', 'lib'));
 
var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    cloudservers = require('cloudservers'),
    helpers = require('./helpers');
    
var testContext = {};

vows.describe('node-cloudservers/flavors').addBatch({
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
    "the getFlavors() method": {
      "with no details": {
        topic: function () {
          cloudservers.getFlavors(this.callback);
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
          cloudservers.getFlavors(true, this.callback);
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
        cloudservers.getFlavor(testContext.flavors[0].id, this.callback);
      },
      "should return a valid flavor": function (err, flavor) {
        helpers.assertFlavorDetails(flavor);
      }
    }
  }
}).export(module);