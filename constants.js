'use strict';

async function constants(configuration) {

  module.exports.service = configuration.service;
  module.exports.email = configuration.email;
  module.exports.password = configuration.password;
      module.exports.appName = configuration.appName;


}
module.exports = {
  constants: constants,
};
