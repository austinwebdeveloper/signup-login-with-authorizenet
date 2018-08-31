'use strict';

async function configPort(configuration) {

  module.exports.port = configuration.port;
 

}
module.exports = {
  configPort: configPort,
};
