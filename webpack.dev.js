const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    port: 9000,
    hot: true,
    open: true,
    
    // ✅ Disable cache untuk development
    devMiddleware: {
      writeToDisk: false,
    },
    
    // ✅ Force reload on change
    watchFiles: {
      paths: ['src/**/*'],
      options: {
        usePolling: true,
      },
    },
    
    // ✅ Headers untuk disable cache
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    },
  },
});