/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/scripts/index.js'),

  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // otomatis bersihkan folder dist sebelum build
  },

  module: {
    rules: [
      // JavaScript loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },

      // CSS loader
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // ekstrak CSS ke file terpisah
          'css-loader',
        ],
      },

      // File loader untuk gambar dan aset lain
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][hash][ext][query]',
        },
      },

      // Font loader (opsional)
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][hash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: 'body', // script bundle di akhir body
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/public', to: 'public' },
        { from: 'src/sw.js', to: 'sw.js' },
        { from: 'src/sw.js', to: '.' },
      ],
    }),
  ],

  resolve: {
    extensions: ['.js'],
  },
};
