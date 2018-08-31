'use strict';

async function paymentKeysConfig(configuration) {

  module.exports.apiLoginKey = configuration.apiLoginKey;
  module.exports.transactionKey = configuration.transactionKey;

}
module.exports = {
  paymentKeysConfig: paymentKeysConfig,
};
