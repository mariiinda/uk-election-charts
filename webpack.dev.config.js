const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const OfflinePlugin = require("offline-plugin");

module.exports = {
  entry: {
    vendor: ["react", "react-dom", "redux", "react-redux"],
    app: "./src/index.jsx"
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3030,
    filename: "[name].bundle.js"
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
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
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
      }
    ]
  },

  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false)
    }),
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
      favicon: "favicon.ico",
      template: "./templates/index.html",
      name: "index.html"
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map"
    }),
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
