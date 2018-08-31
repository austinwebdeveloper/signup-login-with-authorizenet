const application = require('@loopback/dist-util').loadDist(__dirname);
var config = require('./datasourceconfiguration');
var modelConfiguration = require('./modelconfiguration')
var paymentKeysConfig = require('./paymentKeysConfig');
var paymentConfiguration = require('./paymentConfig');
var constants = require('./constants');
var updateport = require('./updateport');

module.exports = application;
async function getstart() {

  application.main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
module.exports = {
  getstart: getstart,
  config: config,
  modelConfiguration: modelConfiguration,
  paymentKeysConfig: paymentKeysConfig,
  paymentConfiguration: paymentConfiguration,
  constants: constants,
  updatePort:updateport
};
