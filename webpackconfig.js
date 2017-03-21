const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  devtool: 'eval-source-map',
  entry: [path.join(__dirname, 'app/main.js'), path.join(__dirname, 'dist/main.sass')],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { // regular css files
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader?importLoaders=1',
        }),
      },
      {
        test: /\.js?$|\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract(['css-loader','sass-loader' ]),
      }
    ],
  },
  plugins: [

    //new ExtractTextPlugin({ filename: 'dist/main.css', allChunks: true }),
    new ExtractTextPlugin({ filename: path.join(__dirname, 'dist/main.css'), allChunks: true }),
  ],
};

module.exports = config;
