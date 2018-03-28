const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.module.js',
    libs: [
      'angular-material',
      'angular-aria',
      'angular-animate',
      'angular',
      '@uirouter/angularjs', 
      'jquery'
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, './dist'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: false, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: false, // only errors & warns on hot reload
    // ...
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: { collapseWhitespace: true, removeComments: true },
      filename: 'index.html',
      template: path.join(__dirname, 'index.html'),
      chunks: ['app', 'libs']
    }),
    new webpack.HotModuleReplacementPlugin({}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['ng-annotate-loader', 'babel-loader']
      },
      {
        test: /\.html/,
        exclude: /(node_modules)/,
        use: 'html-loader'
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};