var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, '.');

var config = {
  entry: {
    main: [APP_DIR + '/src/public/js/popup.jsx'],
    vendor: ['react', 'react-dom']
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js',
    // The name of the global variable which the library's
    // require() function will be assigned to
    //library: '[name]_lib'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js', Infinity),
    new ExtractTextPlugin('styles.css')
  ],
  //devtool: 'source-map',
  module: {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      },
      {
        test: /\.css$/,
        include: /src/,
        loader: "style-loader!css-loader" //["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        include : /src/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};

module.exports = config;
