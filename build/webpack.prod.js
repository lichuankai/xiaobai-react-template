const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const prodConfig = merge(commonConfig(), {
  entry: {
    // 配置入口文件
    main: path.resolve(__dirname, '../src/index.tsx')
  },
  mode: 'production',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        dll: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router|babel-polyfill|mobx|mobx-react|mobx-react-dom|antd|@ant-design)/,
          minChunks: 1,
          priority: 2,
          name: 'dll'
        },
        codeMirror: {
          test: /[\\/]node_modules[\\/](react-codemirror|codemirror)/,
          minChunks: 1,
          priority: 2,
          name: 'codemirror'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          priority: 1,
          name: 'vendors'
        }
      }
    }
  }
}
)
// 方便排查生产环境打包后文件的错误信息（文件source map）
if (process.env.npm_lifecycle_event === 'build:watch') {
  prodConfig = merge(prodConfig, {
    devtool: 'cheap-source-map'
  })
}

// 图形化分析打包文件大小
if (process.env.npm_lifecycle_event === 'build:report') {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
  prodConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = merge(commonConfig(), prodConfig);