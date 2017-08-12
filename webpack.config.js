// const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = (process.env.NODE_ENV === 'production');

const extractSass = new ExtractTextPlugin({
  filename: 'css/[name].css'
});

const config = {
  entry: {
    popup: './src/popup.js',
    options: './src/options.js',
    update: './src/update.js'
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
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', ignore: ['.DS_Store'] },
      { from: 'src/html', to: 'html', ignore: ['.DS_Store'] },
      { from: 'src/images', to: 'images', ignore: ['.DS_Store'] }
      // { from: 'src/_locales', to: '_locales' }
    ]),
    extractSass,
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: ['css-loader', 'sass-loader'],
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

if (isProd) {
  config.plugins.push(new BabiliPlugin({}, {
    comments: false
  }));
} else {
  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Output management'
  }));

  config.devtool = '#source-map';
}

module.exports = config;
