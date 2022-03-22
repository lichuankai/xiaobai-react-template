const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
  entry: {
    // 配置入口文件
    main: path.resolve(__dirname, '../src/index.tsx')
  },
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  optimization: {
    sideEffects: true, // 配合tree shaking
    // splitChunks: {} // TODO 拆包
    minimize: true, // 代码压缩
    moduleIds: 'named',
  },
  devServer: {
    port: 9000,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    proxy: {
      '/api': {
        target: 'https://baidu.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/api": "" }
      }
    }
  },
  devtool: 'eval-source-map'
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  // ]
}

module.exports = merge(commonConfig(true), devConfig);