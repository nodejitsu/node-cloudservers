# node-cloudservers

A client implementation for Rackspace CloudServers in node.js


## Installation

### Installing npm (node package manager)
<pre>
  curl http://npmjs.org/install.sh | sh
</pre>

### Installing cloudservers
<pre>
  npm install cloudservers
</pre>

### [Getting Rackspace Account][4]

## Usage

[http://blog.nodejitsu.com/nodejs-cloud-server-in-three-minutes][3]

The node-cloudservers library is compliant with the [Rackspace CloudServers API][0]. Using node-cloudservers is easy for a variety of scenarios: authenticating, getting flavors and images, creating servers, and working with servers.

### Getting Started
Before we can do anything with cloudfiles, we have to create a client with valid credentials. Cloudservers will authenticate for you automatically: 
<pre>
  var cloudservers = require('cloudservers');
  var config = {
    auth : {
      username: 'your-username',
      apiKey: 'your-api-key'
    }
  };
  var client = cloudservers.createClient(config);
</pre>

### Getting Flavors and Images
There are several entities in the [Rackspace CloudServer][4] ecosystem: images, flavors, and servers. Both the getFlavors and getImages methods take an optional first parameter which when set to true will return more details for the objects returned. Here's how to get the list of all available flavors and images associated with your Rackspace account:
<pre>
  client.getFlavors(function (err, flavors) {
    // Dump the flavors we have just received
    util.inspect(flavors);
    example.flavors = flavors;
  });

  client.getImages(function (err, images) {
    // Dump the flavors we have just received
    util.inspect(images);
    example.images = images;
  });
</pre>

### Create Server
If you manually create servers yourself via the [Rackspace CloudServer][4] management console, you can skip this section. For dynamically load balanced applications like [nodejitsu][1], creating servers on-the-fly is important. To create a server, you will need the id of the image and flavor of the server. You can also pass an instance of a node-cloudservers Flavor or Image. 

<pre>
  var options = {
    name: 'test-server',
    image: 49, // Ubuntu Lucid
    flavor: 1, // 256 server
  };

  client.createServer(options, function (err, server) { 
    // Your server is now being built and will be ready shortly
  });
</pre> 

### Setting a 'personality' for a Server
Rackspace CloudServers exposes an API that allows you to include an arbitrary number of files less than 10kb on a new server. Each file must be Base64 encoded. To use this functionality in node-cloudservers just include the path and contents of each file when creating a server:
<pre>
  var options = {
    name: 'test-server',
    image: 49, // Ubuntu Lucid
    flavor: 1, // 256 server
    personality: [{
      path: '/path/on/your/server/file.txt',
      contents: new Buffer('hello world').toString('base64')
    }]
  };
  
  client.createServer(options, function (err, server) { 
    // Your server is now being built and will be ready shortly
  });
</pre>

### Waiting for Servers to Become 'Active'
Once you've created a server, you can't work with it until it has become active. The node-cloudservers library is designed to allow you to wait for a server to meet a set of criteria:
<pre>
  server.setWait({ status: 'ACTIVE' }, 5000, function () {
    // 'server' is now in the ACTIVE state and can be used normally.
  });
</pre>

### Working with Servers
If you have already created a some [Rackspace CloudServer][4] instances it is easy to get them from your account with node-cloudservers with the getServers method. This method takes an optional first parameter that when set to true will return all details for the servers:
<pre>
  client.getServers(true, function (err, servers) {
    // Inspect the servers that have been returned
    util.inspect(servers);
  });
</pre>

Once you're working with servers that are already active there are several operations that you can perform on it:

#### destroy
The 'destroy' method will delete a server from your [Rackspace CloudServer][4] account.
<pre>
  server.destroy(function () {
    // Server has now been destroyed
  });
</pre>

#### disableBackup
The 'disableBackup' method will disable the backup schedule for the Server.
<pre>
  server.disableBackup(function () {
    // Server backup has now been disabled
  });
</pre>

#### getAddresses
The 'getAddresses' method takes a callback which has the set of the valid IP addresses for the Server as a parameter. This method takes an optional first parameter with a value of 'public' or 'private', which will force only the public or private IP addresses to be returned respectively. 
<pre>
  server.getAddresses(function (addresses) {
    // Inspect the addresses that were returned
    util.inspect(addresses);
  });
</pre>

#### getBackup
The 'getBackup' method will get the backup schedule for the Server.
<pre>
  server.getBackup(function (backup) {
    // Inspect the backup schedule that was returned
    util.inspect(backup);
  });
</pre>

#### getDetails
The 'getDetails' method will get the server with all details.
<pre>
  server.getDetails(function (server) {
    // Inspect the server that was returned
    util.inspect(server);
  });
</pre>

#### updateBackup
The 'updateBackup' method will update the backup schedule of the server on which it is called.
<pre>
  var backup = backup = {
    "enabled": true,
    "weekly": "THURSDAY",
    "daily": "H_0400_0600"
  };
  server.updateBackup(backup, function () {
    // Backup schedule has now been updated to match 'backup'
  });
</pre>

## Roadmap

1. Get Server resize operations working: confirmResize, resize, revertResize.
2. Get miscellaneous Server operations working: rebuild.  
3. Get the core 'createImage' operation working.

## Run Tests
All of the node-cloudservers tests are written in [vows][2], and cover all of the use cases described above. You will need to add your Rackspace API username and API key to test/data/test-config.json before running tests:
<pre>
  {
    "auth": {
      "username": "your-username",
      "apiKey": "your-apikey"
    }
  }
</pre>

Once you have valid Rackspace credentials you can run tests with [vows][2]:
<pre>
  vows test/*-test.js --spec
</pre>

### Running Personality tests
One common usage of the personality features in Rackspace CloudServers is to upload your own SSH keys for communicating with your new server. To run these tests you will need to generate a test key locally. 
<pre>
  $ cd /path/to/node-cloudservers
  $ mkdir test/fixtures
  $ ssh-keygen -t rsa
  Generating public/private rsa key pair.
  Enter file in which to save the key (~/.ssh/id_rsa): /path/to/node-cloudservers/test/fixtures/testkey
  Enter passphrase (empty for no passphrase): 
  Enter same passphrase again: 
  Your identification has been saved in /path/to/node-cloudservers/test/fixtures/testkey.
</pre>

<img alt= "This project is built and supported by Nodejitsu. If it does not work as expected, please let us know and we will fix it" src="https://github.com/nodejitsu/node-cloudservers/raw/master/assets/support-by-nodejitsu.png"/></img>


#### Author: [Charlie Robbins](http://www.charlierobbins.com)
#### Contributors: [Elijah Insua](http://github.com/tmpvar) [Matthew Bergman](http://github.com/fotoverite)

[0]: http://docs.rackspacecloud.com/servers/api/cs-devguide-latest.pdf
[1]: http://nodejitsu.com
[2]: http://vowsjs.org
[3]: http://blog.nodejitsu.com/nodejs-cloud-server-in-three-minutes
[4]: http://www.rackspacecloud.com/1469-0-3-13.html
