// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CreateFileWebpack = require('create-file-webpack');
const TerserPlugin = require('terser-webpack-plugin');

const pickerStyles = fs
  .readFileSync(path.join(__dirname, 'src', 'style.css'))
  .toString()
  .replace(/\n/gi, ''); // load styles.css

module.exports = (env, args) => {
  const browserTarget =
    env && env.target == 'ie'
      ? {
          targets: {
            chrome: '58',
            ie: '9',
          },
          useBuiltIns: 'usage',
        }
      : {};

  // Check if we want an unminified production build
  const isUnminified = env && env.unminified;
  const withSourceMap = env && env.sourcemap;

  return {
    context: __dirname,
    entry: './src/html-duration-picker.js',
    devtool: withSourceMap ? 'source-map' : false,
    optimization: {
      minimize: args.mode === 'production' && !isUnminified,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: 'all', // Keep all comments when using source maps
            },
          },
        }),
      ],
    },
    output: {
      path:
        args.mode == 'development'
          ? path.resolve(__dirname, 'src/compiled')
          : path.resolve(__dirname, 'dist'),
      filename:
        args.mode == 'development' 
          ? 'html-duration-picker.js' 
          : isUnminified 
            ? 'html-duration-picker.js'
            : 'html-duration-picker.min.js',
      library: 'HtmlDurationPicker',
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this',
    },
    devServer: {
      static: path.join(__dirname, 'src'),
      compress: true,
      port: 9000,
      open: true,
      hot: true,
      allowedHosts: 'all',
      host: '127.0.0.1',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['babel-plugin-remove-template-literals-whitespace'],
              presets: [['@babel/preset-env', browserTarget]],
              comments: !!(isUnminified || withSourceMap), // Keep comments for unminified builds
            },
          },
        },
        {
          test: /\.js$/,
          loader: 'string-replace-loader',
          options: {
            search: '__RELEASE_VERSION__',
            replace: process.env.npm_package_version,
            flags: 'g',
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        PICKER_STYLES_CSS_CONTENTS: JSON.stringify(pickerStyles),
        PICKER_RELEASE_VERSION: 'test ver',
      }),
      new CreateFileWebpack({
        path: './dist',
        fileName: 'html-duration-picker.min.d.ts',
        content: `declare module '${process.env.npm_package_name}'`,
      }),
    ],
  };
};
