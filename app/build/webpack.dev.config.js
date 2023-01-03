const { merge } = require('webpack-merge');
const fs = require("fs")
const { HotModuleReplacementPlugin } = require("webpack")
// 引入基本配置
const baseWebpackConfig = require('./webpack.base.config.js')
baseWebpackConfig.plugins.push(
  new HotModuleReplacementPlugin()
)
const devWebpackConfig = merge(baseWebpackConfig, {
  //这里是开发环境配置内容
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    host: '127.0.0.1',  // 配置启动ip地址
    port: 8080,  // 配置端口
    // open: true, // 配置是否自动打开浏览器
    compress: true,
    hot: true, //热更新
    //配置代理 解决跨域
    proxy: {
      // http://localhost:8080/api
      "/api": {    // 这里的`/api`是自定义的
        // http://localhost:8080/api/users = >  https://api.github.com/api/users
        target: "https://api.github.com/", //这里是真实的接口baseURL
        //http://localhost:8080 => https://api.github.com
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          //去掉 '/api/'
          // http://localhost:8080/api/users = >  https://api.github.com/users
          "^/api": "", // 这里的`^/api`也是是自定义的
        },
      },
    }
  },
  // target: 'web', //热更新
})
// 最后通过 module.exports 导出
module.exports = devWebpackConfig
