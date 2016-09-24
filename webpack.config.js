const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cssnano = require('cssnano')
const path = require('path')

const vendor = [
  'calculate-size',
  'classnames',
  'graphiql',
  'immutable',
  'js-cookie',
  'lokka',
  'lokka-transport-http',
  'map-props',
  'moment',
  'normalize.css',
  'rc-tooltip',
  'react',
  'react-addons-pure-render-mixin',
  'react-autocomplete',
  'react-click-outside',
  'react-copy-to-clipboard',
  'react-datetime',
  'react-dom',
  'react-notification-system',
  'react-redux',
  'react-relay',
  'react-router',
  'react-router-relay',
  'react-tagsinput',
  'react-tether',
  'react-tooltip',
  'react-twitter-widgets',
  'redux',
  'redux-thunk',
  'smooch',
]

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './src/main',
    vendor,
  },
  output: {
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.ts(x?)$/,
      loader: 'tslint',
      exclude: /node_modules/,
    }, {
      test: /\.json/, // TODO check if still needed
      loader: 'json',
    }, {
      test: /\.css/,
      loader: 'style!css',
    }, {
      test: /\.scss/,
      loader: 'style!css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap',
      exclude: /node_modules/,
    }, {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'babel!awesome-typescript',
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }, {
      test: /\.mp3$/,
      loader: 'file',
    }, {
      test: /icons\/.*\.svg$/,
      loader: 'raw!svgo',
    }, {
      test: /graphics\/.*\.svg$/,
      loader: 'file',
    }, { // TODO remove this loader and also `imports-loader` dependency
      test: /load-image/,
      loader: 'imports?define=>false',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BACKEND_ADDR__: JSON.stringify(process.env.BACKEND_ADDR.toString()),
      __SEGMENT_TOKEN__: '"mxShPAuQCvtbX7K1u5xcmFeqz9X7S7HN"',
      __ENABLE_SEGMENT__: false,
      __SMOOCH_TOKEN__: '"505tvtkv5udrd4kc5dbpppa6x"',
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html',
    }),
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
    new webpack.optimize.CommonsChunkPlugin('vendor'),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          cssnano({
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll: true,
            },
            safe: true,
          })
        ],
        svgo: {
          plugins: [
            {removeStyleElement: true},
          ],
        },
      }
    }),
  ],
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    alias: { // TODO remove when resolved: https://github.com/smooch/smooch-js/issues/357
      faye: 'faye/browser/faye-browser',
    },
  },
}
