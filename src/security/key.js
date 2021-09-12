const config = require('../config');

module.exports = (request) => {
  if (!config.presharedAuthHeaderEnabled) return true;

  const psk = request.headers.get(config.presharedAuthHeaderKey);
  return psk === config.presharedAuthHeaderValue;
};
