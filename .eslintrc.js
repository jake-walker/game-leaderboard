module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    worker: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
  ignorePatterns: ['worker/**/*.js', 'dist/**/*.js'],
  globals: {
    LEADERBOARD: 'writable',
  },
};
