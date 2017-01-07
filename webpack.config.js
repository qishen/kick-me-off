var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, '.');

var config = {
  entry: {
    main: [APP_DIR + '/src/public/js/popup.jsx'],
    content: [APP_DIR + '/src/content.jsx'],
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
    new ExtractTextPlugin('styles.css'),
    // Copy background.js to build folder because chrome.tabs.executeScript only
    // accept file name but not relative path of file.
    // new CopyWebpackPlugin([{ from: APP_DIR + '/src/background.js' },])
  ],
  //devtool: 'source-map',
  module: {
    loaders : [
      {
        test : /\.jsx?/,
        include : /src/,
        loader : 'babel'
      },
      {
        test: /\.css$/,
        include: /src/,
        loader: "style-loader!css-loader"
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
