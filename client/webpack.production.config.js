'use strict';

const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.jsx',
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: '[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders,
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        unsafe: true,
        pure_getters: true,
        unsafe_comps: true,
        drop_console: true,
        drop_debugger: true,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      file: {
        js: ['bundle.js'],
      },
    }),
    // new BundleAnalyzerPlugin(),
  ],
};

