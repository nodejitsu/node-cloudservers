/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    request = require('request'),
    cloudservers = require('../cloudservers');

var utils = exports;

// Failure HTTP Response codes based
// off Rackspace CloudServers specification.
var failCodes = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Resize not allowed",
  404: "Item not found",
  409: "Build in progress",
  413: "Over Limit",
  415: "Bad Media Type",
  500: "Fault",
  503: "Service Unavailable"
};

// Export the set of Failure Codes
utils.failCodes = failCodes;

// Success HTTP Response codes based
// off Rackspace CloudServers specification.
var successCodes = {
  200: "OK",
  202: "Accepted",
  203: "Non-authoritative information",
  204: "No content",
};

// Export the set of Success Codes
utils.successCodes = successCodes;

//
// Core method that actually sends requests to Rackspace.
// This method is designed to be flexible w.r.t. arguments
// and continuation passing given the wide range of different
// requests required to fully implement the CloudServers API.
//
// Continuations:
//   1. 'callback': The callback passed into every node-cloudservers method
//   2. 'success':  A callback that will only be called on successful requests.
//                  This is used throughout node-cloudservers to conditionally
//                  do post-request processing such as JSON parsing.
//
// Possible Arguments (1 & 2 are equivalent):
//   1. utils.rackspace('some-fully-qualified-url', client, callback, success)
//   2. utils.rackspace('GET', 'some-fully-qualified-url', client, callback, success)
//   3. utils.rackspace('DELETE', 'some-fully-qualified-url', client,  callback, success)
//   4. utils.rackspace({ method: 'POST', uri: 'some-url', body: { some: 'body'}, client: new cloudservers.Client }, callback, success)
//
utils.rackspace = function () {
  var args = Array.prototype.slice.call(arguments),
      success = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      uri, method, requestBody, client, headers = {};

  // Now that we've popped off the two callbacks
  // We can make decisions about other arguments
  if (args.length == 1) {
    method = args[0]['method'] || 'GET',
    uri = args[0]['uri'];
    requestBody = args[0]['body'];
    client = args[0]['client'];
  }
  else if (args.length === 2) {
    // If we got a string assume that it's the URI
    method = 'GET';
    uri = args[0];
    client = args[1];
  }
  else {
    method = args[0];
    uri = args[1];
    client = args[2];
  }

  //
  // Makes the raw request to Rackspace Cloudfiles
  //
  function makeRequest () {
    // Append the X-Auth-Token header for Rackspace authenticatio
    headers['X-AUTH-TOKEN'] = client.config.authToken;
    var serverOptions = {
      uri: uri.replace(/\.json$/,''),
      method: method,
      headers: headers
    };

    if (typeof requestBody !== 'undefined') {
      serverOptions.headers['Content-Type'] = 'application/json';
      serverOptions.body = JSON.stringify(requestBody);
    }
    else if (typeof requestBody !== 'undefined') {
      serverOptions.body = requestBody;
    }

    request(serverOptions, function (err, res, body) {
      if (err) {
        if (callback) callback(err);
        return;
      }

      var statusCode = res.statusCode.toString();
      if (Object.keys(failCodes).indexOf(statusCode) !== -1) {
        if (callback) callback(new Error('Rackspace Error (' + statusCode + '): ' + failCodes[statusCode]));
        return;
      }

      success(body, res);
    });
  }

  if (client.authorized) {
      uri = client.serverUrl.apply(client, [].concat(uri));
      makeRequest();
  }
  else {
    client.setAuth(function (err, res) {
      if (err) return callback(err);
      uri = client.serverUrl.apply(client, [].concat(uri));
      makeRequest();
    });
  }
};

var contentTypeOptions = '-i -H "Content-Type: application/json" ';
var authTokenOptions = '-i -H "X-AUTH-TOKEN:{{auth-token}}" ';
var curlOptions = '-X "{{method}}" {{uri}}';

utils.rackspaceCurl = function (method, uri, client, callback, success) {
  function makeRequest() {
    var options = 'curl ', error = '', data = '';

    if (method === 'POST') {
      options += contentTypeOptions;
    }

    options += authTokenOptions.replace('{{auth-token}}', client.config.authToken);
    options += curlOptions.replace('{{method}}', method).replace('{{uri}}', uri);

    exec(options, function (error, stdout, stderr) {
      if (error) return callback(error);

      var statusCode = stdout.match(/HTTP\/1.1\s(\d+)/)[1];
      if (Object.keys(failCodes).indexOf(statusCode.toString()) !== -1) {
        return callback(new Error('Rackspace Error (' + statusCode + '): ' + failCodes[statusCode]));
      }

      callback(null, { statusCode: statusCode });
    });
  }
  if (client.authorized) {
      makeRequest();
  }
  else {
    client.setAuth(function (err, res) {
      if (err) return callback(err);
      uri = client.serverUrl() + uri;
      makeRequest();
    });
  }
};
