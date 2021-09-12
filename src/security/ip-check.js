const ipRangeCheck = require('ip-range-check');
const config = require('../config');

module.exports = (request) => {
  if (!config.allowedIpsEnabled) return true;

  const ip = request.headers.get('CF-Connecting-IP');
  return ipRangeCheck(ip, config.allowedIps);
};
