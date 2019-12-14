require("uglifyjs-webpack-plugin");
require("autoprefixer");

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const VendorCSS = new ExtractTextPlugin(
  "assets/css/vendor.[md5:contenthash:hex:20].css"
);
const CustomCSS = new ExtractTextPlugin(
  "assets/css/main.[md5:contenthash:hex:20].css"
);

module.exports = {
  mode: "production",
  entry: {
    index: "./src/js/index.js",
    vendor: ["jquery"]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          enforce: true,
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: "./src/images/",
        to: "./images/"
      }
    ]),
    new HtmlWebpackPlugin({
      template: "./src/template/base.twig",
      filename: "../../templates/base.twig"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CleanObsoleteChunks(),
    VendorCSS,
    CustomCSS
  ],
  output: {
    filename: "assets/js/[name].[chunkhash:8].js",
    path: path.resolve(__dirname, "./web/build"),
    chunkFilename: "assets/js/[name].[chunkhash:8].js",
    publicPath: "/build/"
  },
  devtool: "src-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "style-loader",
              options: {
                minimize: true
              }
            }
          ]
        })
      },
      {
        test: /vendor.sass$/,
        use: VendorCSS.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            "resolve-url-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /main.sass$/,
        use: CustomCSS.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            "resolve-url-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(html|twig)$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: false,
              attrs: ["img:src", "a:href"]
            }
          }
        ]
      },
      {
        test: /\.(mp4|ogv)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash:8].[ext]",
              outputPath: "assets/video/",
              useRelativePath: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash:8].[ext]",
              outputPath: "assets/",
              useRelativePath: true
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 100,
                enabled: true
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                enabled: true
              },
              gifsicle: {
                interlaced: false
              }
            }
          },
          {
            loader: "image-maxsize-webpack-loader"
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash:8].[ext]",
              outputPath: "assets/",
              useRelativePath: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash:8].[ext]",
              outputPath: "assets/",
              useRelativePath: true
            }
          },
          {
            loader: "image-webpack-loader"
          }
        ]
      }
    ]
  }
};
