var http = require('http');
var ecstatic = require('ecstatic');
var path = require('path');
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require("webpack-dev-server");

var sketch = process.argv[2];

if(!sketch) {
  console.log('You must specify which sketch to build!');
  process.exit(0);
}

var srcDir = path.join(__dirname, 'src', sketch);
var buildDir = path.join(__dirname, 'build');
var sketchDir = path.join(buildDir, sketch);

var compiler = webpack({
  entry: path.join(srcDir, 'index.js'),
  output: {
    path: sketchDir,
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  devtool: 'source-map',
  plugins: [new HtmlWebpackPlugin({
    title: 'Hive',
    filename: 'index.html',
    template: path.join(srcDir, 'index.html'),
    inject: true
  })]
});

http.createServer(
  ecstatic({ root: buildDir })
).listen(8080, function() {
  console.log('Open http://localhost:8080/' + sketch + ' to run the sketch.');
});

compiler.watch({
    aggregateTimeout: 300,
    poll: true
}, function(err, stats) {
    if(err) {
      console.error(err);
    } else {
      var file = stats.compilation.options.entry;
      var buildTime = (stats.endTime - stats.startTime) / 1000;
      console.log('Built file ' + file + ' in ' + buildTime + ' seconds.');
    }
});

