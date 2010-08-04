/*
 * cloudservers.js: Wrapper for node-cloudservers object
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var path = require('path');

var cloudservers = exports;

cloudservers.setAuth = require('cloudservers/core').setAuth;
cloudservers.config = require('cloudservers/config').config;
cloudservers.createServer = require('cloudservers/core').createServer;
cloudservers.getServer = require('cloudservers/core').getServer;
cloudservers.getServers = require('cloudservers/core').getServers;
cloudservers.Server = require('cloudservers/cloud-server').Server;
