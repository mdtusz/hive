var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './build'
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Hive',
    filename: 'index.html',
    template: 'src/index.html',
    inject: true
  })]
};
