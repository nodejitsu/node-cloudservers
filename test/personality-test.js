/*
 * authentication-test.js: Tests for rackspace cloudservers authentication
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var path    = require('path'),
    vows    = require('vows'),
    assert  = require('assert'),
    spawn   = require('child_process').spawn,
    fs      = require('fs'),
    helpers = require('./helpers'),
    key     = fs.readFileSync(__dirname + "/files/testkey.pub",'base64').toString("base64");

require.paths.unshift(path.join(__dirname, '..', 'lib'));

var cloudservers = require('cloudservers'),
    testServer;

vows.describe('node-cloudservers/personalities').addBatch({
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
    "the create() method": {
      "with image and flavor ids": {
        topic: function () {
          cloudservers.createServer({
            name: 'create-personality-test',
            image: 49, // Ubuntu Lucid
            flavor: 1, // 256 server
            "personality" : [{
              path     : "/root/.ssh/authorized_keys",
              contents : key
            }]
          }, this.callback);
        },
        "should return a valid server": function (server) {
          testServer = server;
          helpers.assertServerDetails(server);
        }
      }
    }
  }
}).addBatch({
  "connect via ssh" : {
    topic : function() {
      var data = "", self = this;
      testServer.setWait({ status: 'ACTIVE' }, 5000, function () {

        var ssh  = spawn('ssh', [
          '-i',
          __dirname + '/files/testkey',
          '-o',
          'StrictHostKeyChecking no',
          'root@' + testServer.addresses.public[0],
          'cat /root/.ssh/authorized_keys'
        ]);
        
        var e = function(err) {
          console.log(err);
        };
        ssh.stderr.on("error", e);
        ssh.stderr.on("data", function(chunk) {
          data += chunk;
        });
        ssh.stdout.on("error", e);
        ssh.stdout.on("data", function(chunk) {
          data += chunk;
        });
        ssh.on('error', e);
        ssh.on('exit', function() {
          self.callback(data)
        });
      });
    },
    "should connect without a password prompt": function(output) {
      console.log("OUTPUT", output);
      assert.true(output.indexOf(key) > 0);
    }
  }
}).addBatch({
  "the destroy() method with the second server": {
    topic: function () {
      var self = this;
      testServer.setWait({ status: 'ACTIVE' }, 5000, function () {
        testServer.destroy(self.callback);
      });
    },
    "should respond with 202": function (err, res) {
      assert.equal(res.statusCode, 202); 
    }
  } 
}).export(module);