'use strict';

async function paymentConfiguration(configuration) {
  module.exports.amount = configuration.amount;
  module.exports.trail_amount = (configuration.trail_amount ? configuration.trail_amount : 0)
  module.exports.interval_length = (configuration.interval_length ? configuration.interval_length : 1)
  module.exports.interval_unit = (configuration.interval_unit ? configuration.interval_unit : 'months')

}
module.exports = {
  paymentConfiguration: paymentConfiguration,
};
