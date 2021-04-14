// const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// `terser-webpack-plugin` can be used by default as webpack depends on it.
const TerserPlugin = require('terser-webpack-plugin');

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
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist'],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json' },
        { from: 'src/html', to: 'html' },
        { from: 'src/images', to: 'images' }
        // { from: 'src/_locales', to: '_locales' }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
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
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
