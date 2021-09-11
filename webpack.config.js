module.exports = {
  target: 'webworker',
  mode: 'production',
  resolve: {
    extensions: ['*', '.mjs', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },
  optimization: {
    usedExports: true,
  },
}
