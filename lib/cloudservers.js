/*
 * cloudservers.js: Wrapper for node-cloudservers object
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(__dirname); 

var cloudservers = exports;

// Core
cloudservers.setAuth      = require('cloudservers/core').setAuth;
cloudservers.getVersion   = require('cloudservers/core').getVersion;
cloudservers.getLimits    = require('cloudservers/core').getLimits;
cloudservers.config       = require('cloudservers/config').config;

// Servers
cloudservers.createServer = require('cloudservers/core').createServer;
cloudservers.getServer    = require('cloudservers/core').getServer;
cloudservers.getServers   = require('cloudservers/core').getServers;

// Flavors
cloudservers.getFlavors   = require('cloudservers/core').getFlavors;
cloudservers.getFlavor    = require('cloudservers/core').getFlavor;

// Images
cloudservers.createImage  = require('cloudservers/core').createImage;
cloudservers.getImages    = require('cloudservers/core').getImages;
cloudservers.getImage     = require('cloudservers/core').getImage;

// Type Definitions
cloudservers.Server       = require('cloudservers/cloud-server').Server;
cloudservers.Flavor       = require('cloudservers/flavor').Flavor;
cloudservers.Image        = require('cloudservers/image').Image;