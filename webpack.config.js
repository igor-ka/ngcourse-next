var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'app'),
  
  stats: {
    colors: true,
    reasons: true
  },
  
  entry: {
    app: './src/app.ts',
    vendor: [
      'lodash-compat',
      'immutable',
      'rx',
      'angular',
      'angular-ui-router',
      'koast-angular',
      'basscss/css/basscss.css',
      'font-awesome/css/font-awesome.css'
    ]
  },
  
  output: {
    path: path.resolve(__dirname, 'app', '__build'),
    filename: '[name].[hash].bundle.js',
    publicPath: "/",
    sourceMapFilename: '[name].[hash].bundle.js.map',
    chunkFilename: '[id].chunk.js'
  },
  
  devtool: 'source-map',
  
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[hash].bundle.js'),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      inject: 'body',
      minify: false
    })
  ],
  
  module: {
    preLoaders: [{
      test: /\.ts$/,
      loader: 'tslint'
    }],
    loaders: [
      { test: /\.ts$/, loader: 'ts', exclude: /node_modules/ },
      { test: /\.html$/, loader: 'raw' },
      { test: /\.css$/, loader: 'style-loader!css-loader?sourceMap' },
      { test: /\.svg/, loader: 'url' },
      { test: /\.eot/, loader: 'url' },
      { test: /\.woff/, loader: 'url' },
      { test: /\.woff2/, loader: 'url' },
      { test: /\.ttf/, loader: 'url' },
    ]
  },
  
  devServer: {
    inline: true,
    colors: true,
    contentBase: './app/__build',
    publicPath: '/'
  }
}