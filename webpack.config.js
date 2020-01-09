/**
 * Configs file for bundling
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var TerserPlugin = require('terser-webpack-plugin');

function getOptimization(isMinified) {
  if (isMinified) {
    return {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          extractComments: false
        })
      ]
    };
  }

  return {
    minimize: false
  };
}

module.exports = function(env, argv) {
  var isProduction = argv.mode === 'production';
  var isMinified = !!argv.minify;
  var FILENAME = pkg.name + (isMinified ? '.min' : '');
  var BANNER = [
    'TOAST UI Rolling',
    '@version ' + pkg.version,
    '@author ' + pkg.author,
    '@license ' + pkg.license
  ].join('\n');

  return {
    mode: 'development',
    entry: './src/js/rolling.js',
    output: {
      library: ['tui', 'Rolling'],
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist',
      filename: FILENAME + '.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(test|node_modules|bower_components)/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            failOnError: isProduction
          }
        }
      ]
    },
    plugins: [new webpack.BannerPlugin(BANNER)],
    optimization: getOptimization(isMinified),
    devServer: {
      historyApiFallback: false,
      progress: true,
      host: '0.0.0.0',
      disableHostCheck: true
    }
  };
};
