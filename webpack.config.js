/*
 * This file is part of Invenio.
 * Copyright (C) 2017-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: {
    lib: [
      path.resolve(__dirname, './src/index.js')
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'inveniographs'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src/'),
        path.resolve(__dirname, 'test/')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      use: [{
        loader: 'babel-loader',
        options: { presets: ['es2015'] }
      }]
    }]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin()
  ]
};
