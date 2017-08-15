const fs = require('fs');
const path = require('path');
const env = require('yargs').argv.env;
const BannerWebpackPlugin = require('banner-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

/* Common module loaders for all configuration objects */
const moduleLoaders = {
  rules: [
    {
      test: /(\.jsx|\.js)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader'
      }, {
        loader: 'eslint-loader'
      }]
    },
    {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }]
    },
    {
      test: /\.js$|\.jsx$/,
      use: {
        loader: 'istanbul-instrumenter-loader',
        options: {
          esModules: true
        }
      },
      enforce: 'post',
      exclude: [/test/, /node_modules/, /src\/util/]
    }
  ]
};

/* Configuration for bundling the core library */
const libConfig = {
  entry: {
    lib: path.resolve(__dirname, './src/index.js')
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'inveniographs',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    d3: 'd3',
    lodash: '_',
    'd3-tip': 'd3Tip',
    'd3-svg-legend': 'legendColor'
  },
  watch: false,
  module: moduleLoaders,
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new BannerWebpackPlugin({
      chunks: {
        lib: {
          beforeContent: `/* ${fs.readFileSync('./.license', 'utf8')} */`
        }
      }
    })
  ]
};

/* Configuration for bundling the examples */
const examplesConfig = {
  entry: {
    bar: path.resolve(__dirname, './examples/bar/index.js'),
    line: path.resolve(__dirname, './examples/line/index.js'),
    groupedBar: path.resolve(__dirname, './examples/groupedBar/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'examples/dist')
  },
  watch: true,
  externals: {
    d3: 'd3',
    lodash: '_',
    'd3-tip': 'd3Tip',
    'd3-svg-legend': 'legendColor'
  },
  module: moduleLoaders,
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new BannerWebpackPlugin({
      chunks: {
        line: {
          beforeContent: `/* ${fs.readFileSync('./.license', 'utf8')} */`
        },
        bar: {
          beforeContent: `/* ${fs.readFileSync('./.license', 'utf8')} */`
        }
      }
    })
  ]
};

/* Export the correct webpack configuration, based on env variable */
if (env === 'dev') {
  module.exports = [libConfig];
} else if (env === 'examples') {
  module.exports = [examplesConfig];
}
