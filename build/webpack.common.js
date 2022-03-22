const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniCssExtracePlugin = require('mini-css-extract-plugin');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const commonConfig = (devMode) => {
  return {
    mode: 'development',
    optimization: {
      removeAvailableModules: true, // 删除已解决的chunk (默认 true)
      removeEmptyChunks: true, // 删除空的chunks (默认 true)
      mergeDuplicateChunks: true // 合并重复的chunk (默认 true)
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [path.join(__dirname, '../src')],
          exclude: /(node_modules|bower_components)/,
          use: ["happypack/loader?id=happybabel", 'ts-loader']
        },
        {
          test: /\.less$/,
          use: [
            devMode  ? "style-loader" : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            devMode ? "style-loader" : MiniCssExtracePlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: ['url-loader'],
          include: [path.join(__dirname, '../src')]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          use: ['url-loader'],
          include: [path.join(__dirname, '../src')]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: ['url-loader'],
          include: [path.join(__dirname, '../src')]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${path.join(__dirname, '../public')}/index.html`
      }),
      new MiniCssExtracePlugin({
        filename: "[name].[contenthash:8].css",
        chunkFilename: "chunk/[id].[contenthash:8].css"
      }),
      new HappyPack({
        id: 'happybabel',
        loaders: ["babel-loader?cacheDirectory=true"],
        threadPool: happyThreadPool,
        cache: true,
        verbose: true
      }),
      new FriendlyErrorsWebpackPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.join(__dirname, '../src'),
        '@pages': path.join(__dirname, '../src/page')
      }
    }
  }
}

module.exports = commonConfig;