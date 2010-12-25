## ChangeLog for: node-cloudservers

### Version 0.2.0 - 12/25/2010
- Improved test coverage
- Pushed test config out of lib/ to test/data/test-config.json

#### Breaking Changes
- cloudservers no longer exposes methods on the module itself. Replace cloudservers.* with client.* where var client = cloudservers.createClient(config). 