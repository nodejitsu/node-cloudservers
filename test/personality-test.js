/*
 * personality-test.js: tests cloudserver's ability to add files
 *                      to a server's filesystem during creationg
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    vows = require('vows'),
    cloudservers = require('../lib/cloudservers'),
    helpers = require('./helpers');
    
var keyBuffer = fs.readFileSync(__dirname + '/fixtures/testkey.pub'),
    client = helpers.createClient(),
    testData = {}, 
    testServer;

vows.describe('node-cloudservers/personalities').addBatch({
  "The node-cloudservers client": {
    "the create() method": {
      "with image and flavor ids": {
        topic: function () {
          client.createServer({
            name: 'create-personality-test',
            image: 49, // Ubuntu Lucid
            flavor: 1, // 256 server
            personality : [{
              path     : "/root/.ssh/authorized_keys",
              contents : keyBuffer.toString('base64')
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
    topic : function () {
      var data = "", self = this;
      testServer.setWait({ status: 'ACTIVE' }, 5000, function () {
        var ssh  = spawn('ssh', [
          '-i',
          __dirname + '/fixtures/testkey',
          '-q',
          '-o',
          'StrictHostKeyChecking no',
          'root@' + testServer.addresses.public[0],
          'cat /root/.ssh/authorized_keys'
        ]);
        
        var e = function (err) {
          console.log(err);
        };
        
        ssh.stderr.on("error", e);
        ssh.stderr.on("data", function (chunk) {});
        ssh.stdout.on("error", e);
        ssh.stdout.on("data", function (chunk) {
          data += chunk.toString();
        });
        ssh.on('error', e);
        ssh.on('exit', function () {
          self.callback(null, data)
        });
      });
    },
    "should connect without a password prompt": function (err, output) {
      assert.equal(output, keyBuffer.toString());
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