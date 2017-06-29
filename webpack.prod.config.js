const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const OfflinePlugin = require("offline-plugin");

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

/*
 * We've enabled ExtractTextPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/extract-text-webpack-plugin
 *
 */

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    vendor: ["react", "react-dom", "redux", "react-redux"],
    app: "./src/index.jsx"
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".jsx"]
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, "assets/icons/"),
        use: ["svg-sprite-loader", "svgo-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: path.resolve(__dirname, "assets/icons/"),
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        // Match woff2 in addition to patterns like .woff?v=1.1.1.
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          // Limit at 50k. Above that it emits separate files
          limit: 50000,

          // url-loader sets mimetype if it's passed.
          // Without this it derives it from the file extension
          mimetype: "application/font-woff",

          // Output below fonts directory
          name: "./fonts/[name].[ext]"
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {
              loader: "style-loader"
            }
          ],
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: "[name]__[local]___[hash:base64:5]",
                importLoaders: 1
              }
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: "./postcss.config.js"
                }
              }
            }
          ]
        })
      }
    ]
  },

  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true)
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      // filename: "vendor.js"
      // (Give the chunk a different name)
      minChunks: Infinity
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }),
    new HtmlWebpackPlugin({
      chunks: ["app", "vendor"],
      filename: "index.html",
      name: "index.html",
      hash: true,
      template: "./templates/index.html",
      favicon: "favicon.ico"
    }),
    new UglifyJSPlugin(),
    new SpriteLoaderPlugin(),
    new BundleAnalyzerPlugin({
      // Can be `server`, `static` or `disabled`.
      // In `server` mode analyzer will start HTTP server to show bundle report.
      // In `static` mode single HTML file with bundle report will be generated.
      // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
      analyzerMode: "static",
      // Port that will be used by in `server` mode to start HTTP server.
      analyzerPort: 8888,
      // Path to bundle report file that will be generated in `static` mode.
      // If relative path is provided, it will be relative to bundles output directory
      reportFilename: "webpack/index.html",
      // Automatically open report in default browser
      openAnalyzer: false,
      // If `true`, Webpack Stats JSON file will be generated in bundles output directory
      generateStatsFile: true,
      // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
      // Relative to bundles output directory.
      statsFilename: "webpack/stats.json"
    }),
    // it's always better if OfflinePlugin is the last plugin added
    new OfflinePlugin()
  ]
};
