const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const env = require('yargs').argv.env;
const BannerWebpackPlugin = require('banner-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    lib: [
      path.resolve(__dirname, './src/index.js'),
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'inveniographs',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test:  /\.js$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader'
      },
      {
        test:  /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true
          }
        },
        enforce: 'post',
        exclude: [/test/, /node_modules/, /examples/]
      }
    ]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
  ]
}
