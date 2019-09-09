// const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = (process.env.NODE_ENV === 'production');

const config = {
  mode: isProd ? 'production' : 'development',
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
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
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
} else {
  config.devtool = 'source-map';
}

module.exports = config;
