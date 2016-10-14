const idObj = require('identity-obj-proxy')

global['__BACKEND_ADDR__'] = 'http://test-host'
global['analytics'] = {
  track: () => {}
}
