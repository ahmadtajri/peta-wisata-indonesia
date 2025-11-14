/* eslint-disable no-undef */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',

  // Source map agar debugging lebih mudah
  devtool: 'eval-source-map',

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 9000,               // alamat: http://localhost:9000
    open: true,               // otomatis buka browser
    compress: true,           // aktifkan gzip compression
    historyApiFallback: true, // agar hash-based routing atau SPA tidak error 404
    hot: true,                // hot reload untuk style dan script
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },

  optimization: {
    runtimeChunk: 'single', // agar cache JS lebih efisien
  },
});
