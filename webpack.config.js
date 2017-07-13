const path = require('path');

// process.noDeprecation = true;

const config = {
  entry: {
    lib: path.resolve(__dirname, './src/index.js'),
    bar: './examples/bar/index.js',
    line: './examples/line/index.js'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/src'
  },
  devServer: {
    hot: false,
    contentBase: path.resolve(__dirname, 'examples'),
    publicPath: '/'
  },
  watch: true,
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.scss$/,
        use: [{
          // creates style nodes from JS strings
          loader: 'style-loader'
        }, {
          // translates CSS into CommonJS
          loader: 'css-loader'
        }, {
          // compiles Sass to CSS
          loader: 'sass-loader'
        }]
      }
    ]
  }
};

module.exports = config;
