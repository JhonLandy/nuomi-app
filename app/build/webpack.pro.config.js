const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
// 引入基本配置
const baseWebpackConfig = require('./webpack.base.config.js')

baseWebpackConfig.plugins.push(...[
  new MiniCssExtractPlugin({
    filename: "../app_dist/css/[name].[contenthash].css",
    chunkFilename: "../app_dist/css/[name].[id].css",
  }),
  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify,
      options: {
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
        ],
        filter: (source) => {
          return source.byteLength >= 8 * 1024;
        },
      }
    }
  }),
])
const prodWebpackConfig = merge(baseWebpackConfig, {
  //这里是生产环境配置内容
  mode: "production",
  devtool: false,
  optimization: {
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    minimize: true,   //优化CSS
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,  //使用多进程并发执行，提升构建速度
      }),
      new TerserPlugin({
        parallel: true,
        include: /\/src/,
        terserOptions: {
          minify: TerserPlugin.esbuildMinify
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
    splitChunks: {
      automaticNameDelimiter: "-",
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 4,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        elementPlus: {
          filename: '[name].bundle.js',
          test: /\/node_modules\/element-plus/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  }
})
// 最后通过 module.exports 导出
module.exports = prodWebpackConfig
