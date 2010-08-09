/*
 * image-test.js: Tests for rackspace cloudservers image requests
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

var assertImage = function (image) {
  assert.instanceOf(image, cloudservers.Image);
  assert.isNotNull(image.id);
  assert.isNotNull(image.name);
};

var assertImageDetails = function (image) {
  assertImage(image);
  assert.isNotNull(image.updated);
  assert.isNotNull(image.created);
  assert.isNotNull(image.status);
};

vows.describe('node-cloudservers/images').addBatch({
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
    "the getImages() method": {
      "with no details": {
        topic: function () {
          cloudservers.getImages(this.callback);
        },
        "should return the list of images": function (err, images) {
          testContext.images = images;
          images.forEach(function (image) {
            assertImage(image);
          });
        }
      },
      "with details": {
        topic: function () {
          cloudservers.getImages(true, this.callback);
        },
        "should return the list of images": function (err, images) {
          images.forEach(function (image) {
            assertImageDetails(image);
          });
        }
      }
    }
  }
}).addBatch({
  "The node-cloudservers client": {
    "the getImage() method": {
      topic: function () {
        cloudservers.getImage(testContext.images[0].id, this.callback);
      },
      "should return a valid image": function (err, image) {
        assertImageDetails(image);
      }
    }
  }
}).export(module);