module.exports = {
  allowedIpsEnabled: process.env.LB_ALLOWED_IPS_ENABLED === 'yes',
  allowedIps: process.env.LB_ALLOWED_IPS || ['0.0.0.0/0', '::/0'],

  presharedAuthHeaderEnabled: process.env.LB_PRESHARED_AUTH_HEADER_ENABLED === 'yes',
  presharedAuthHeaderKey: process.env.LB_PRESHARED_AUTH_HEADER_KEY || 'X-Leaderboard-PSK',
  presharedAuthHeaderValue: process.env.LB_PRESHARED_AUTH_HEADER_VALUE || 'keyboardcat',
};
