const path = require('path');
const fs = require('fs');
const BannerWebpackPlugin = require('banner-webpack-plugin');

const moduleLoaders = {
  rules: [
    {
      test: /(\.jsx|\.js)$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      }
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
    }
  ]
};

module.exports = [{
  /* Entry for the main library */
  entry: {
    lib: path.resolve(__dirname, './src/index.js')
  },
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    hot: false,
    contentBase: path.resolve(__dirname, 'examples'),
    publicPath: '/'
  },
  watch: true,
  module: moduleLoaders,
  plugins: [
    new BannerWebpackPlugin({
      chunks: {
        lib: {
          beforeContent: `/* ${fs.readFileSync('./.license', 'utf8')} */`
        }
      }
    })
  ]
},
{
  /* Entry for the examples */
  entry: {
    bar: path.resolve(__dirname, './examples/bar/index.js'),
    line: path.resolve(__dirname, './examples/line/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'examples/dist')
  },
  watch: true,
  module: moduleLoaders,
  plugins: [
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
}];
