/*
 * cloudservers.js: Wrapper for node-cloudservers object
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(__dirname); 

var cloudservers = exports;
cloudservers.createClient = require('cloudservers/core').createClient;
cloudservers.Client       = require('cloudservers/core').clients;
// Type Definitions
cloudservers.Server       = require('cloudservers/cloud-server').Server;
cloudservers.Flavor       = require('cloudservers/flavor').Flavor;
cloudservers.Image        = require('cloudservers/image').Image;