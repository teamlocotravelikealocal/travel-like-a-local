var webpack = require('webpack');
var path = require('path');
const SRC_DIR = path.join(__dirname, './src');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: "inline-sourcemap",
  entry: "./App.js",
  module: {
    rules: [
    // loaders: [
    //   {
    //     // test: /\.jsx?$/,
    //     // exclude: /(node_modules|bower_components)/,
    //     loader: 'babel-loader',
    //     query: {
    //       presets: ['react', 'es2015', 'stage-0'],
    //       plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
    //     }
    //   }
    // ]


      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include :SRC_DIR,
        use: [{
          loader: 'semantic-ui-react-less-loader'
        }, {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['es2015', 'react', 'stage-0'],
            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties']
          }
        }]
      },
      {
        test: /\.css?$/,
        loaders: [ 'style-loader', 'css-loader' ]
      },
  // "url" loader works like "file" loader except that it embeds assets
  // smaller than specified limit in bytes as data URLs to avoid requests.
  // A missing `test` is equivalent to a match.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
  // "file" loader makes sure assets end up in the `build` folder.
  // When you `import` an asset, you get its filename.
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      }
    ]
  },
  output: {
    path: __dirname + "/public/",
    filename: "app.min.js"
  },
   externals: {
    fs: '{}',
    tls: '{}',
    net: '{}',
    console: '{}'
  }
};