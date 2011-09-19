/*
 * cloudservers.js: Wrapper for node-cloudservers object
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var cloudservers = exports;

// Expose version through `pkginfo`.
require('pkginfo')(module, 'version');

// Core functionality
cloudservers.createClient = require('./cloudservers/core').createClient;

// Type Definitions
cloudservers.Client = require('./cloudservers/core').Client;
cloudservers.Server = require('./cloudservers/cloud-server').Server;
cloudservers.Flavor = require('./cloudservers/flavor').Flavor;
cloudservers.Image  = require('./cloudservers/image').Image;