/*
 * image-test.js: Tests for rackspace cloudservers image requests
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

vows.describe('node-cloudservers/images').addBatch({
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
    "the getServers() method": {
      "with no details": {
        topic: function () {
          Client.getServers(this.callback);
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
    "the getImages() method": {
      "with no details": {
        topic: function () {
          Client.getImages(this.callback);
        },
        "should return the list of images": function (err, images) {
          testContext.images = images;
          images.forEach(function (image) {
            helpers.assertImage(image);
          });
        }
      },
      "with details": {
        topic: function () {
          Client.getImages(true, this.callback);
        },
        "should return the list of images": function (err, images) {
          images.forEach(function (image) {
            helpers.assertImageDetails(image);
          });
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getImage() method": {
      topic: function () {
        Client.getImage(testContext.images[0].id, this.callback);
      },
      "should return a valid image": function (err, image) {
        helpers.assertImageDetails(image);
      }
    },
    "the createImage() method": {
      "with a server id": {
        topic: function () {
          Client.createImage('test-image-id', testContext.images[0].id, this.callback);
        },
        "should create a new image": function (image) {
          
        }
      },
      /*"with a server instance": {
        topic: function () {
          //cloudservers.createImage
        },
        "should create a new image": function (image) {
          
        }
      }*/
    }
  }
}).export(module);