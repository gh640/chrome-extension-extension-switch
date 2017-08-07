const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'css/[name].css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  entry: {
    popup: './src/popup.js'
  },
  output: {
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery"
    // }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output management'
    }),
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', ignore: ['.DS_Store'] },
      { from: 'src/html', to: 'html', ignore: ['.DS_Store'] },
      { from: 'src/images', to: 'images', ignore: ['.DS_Store'] }
      // { from: 'src/_locales', to: '_locales' }
    ]),
    extractSass,
  ],
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader?name=[name].[ext]'
        ]
      }
    ]
  }
};
