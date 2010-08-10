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
    helpers = require('./helpers'),
    assert = require('assert');
    
require.paths.unshift(path.join(__dirname, '..', 'lib'));

var cloudservers = require('cloudservers');

var testContext = {};

var findImage = function (name) {
  for(var i = 0; i < testContext.images.length; i++) {
    if(testContext.images[i].name === name) {
      return testContext.images[i];
    }
  }
}

var findFlavor = function (name) {
  for(var i = 0; i < testContext.flavors.length; i++) {
    if(testContext.flavors[i].name === name) {
      return testContext.flavors[i];
    }
  }
}

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
            helpers.assertServer(server);
          });
        }
      },
      "with details": {
        topic: function () {
          cloudservers.getServers(true, this.callback);
        },
        "should return the list of servers": function (err, servers) {
          servers.forEach(function (server) {
            helpers.assertServerDetails(server);
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
        helpers.assertServerDetails(server);
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getImages() method": {
      "with details": {
        topic: function () {
          cloudservers.getImages(true, this.callback);
        },
        "should return the list of images": function (err, images) {
          testContext.images = images;
          images.forEach(function (image) {
            helpers.assertImageDetails(image);
          });
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getFlavors() method": {
      "with details": {
        topic: function () {
          cloudservers.getFlavors(true, this.callback);
        },
        "should return the list of flavors": function (err, flavors) {
          testContext.flavors = flavors;
          flavors.forEach(function (flavor) {
            helpers.assertFlavorDetails(flavor);
          });
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the create() method": {
      "with image and flavor ids": {
        topic: function () {
          cloudservers.createServer({
            name: 'create-test-ids',
            image: 49, // Ubuntu Lucid
            flavor: 1, // 256 server
          }, this.callback);
        },
        "should return a valid server": function (server) {
          helpers.assertServerDetails(server);
        }
      },
      "with image and flavor instances": {
        topic: function () {
          var image = findImage('Ubuntu 10.04 LTS (lucid)');
          var flavor = findFlavor('256 server');
          
          cloudservers.createServer({
            name: 'create-test-objects',
            image: image,
            flavor: flavor,
          }, this.callback);
        },
        "should return a valid server": function (server) {
          helpers.assertServerDetails(server);
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the reboot() method": {
      topic: function () {
        //eyes.inspect(testContext.servers[0]);
        //testContext.servers[0].reboot(this.callback);
      },
      //"should return a valid server": function () {
      //  assertServerDetails(server);
      //}
    }
  }
}).export(module);