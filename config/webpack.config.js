/*
 * @Description:
 * @Author: 莲白
 * @Date: 2022-09-23 08:24:47
 * @LastEditTime: 2022-09-24 11:52:58
 * @LastEditors: 莲白
 */
/**
 * eslint 处理
 */
const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerWebpackPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
/**
 * 公共方法处理相同样式处理代码
 * @param {*} pre  判断是sass或者less
 * @returns
 */
//获取cross-env定义的环境变量

const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV, "99999");
const getStyleloaders = (pre) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre && {
      loader: pre,
      options:
        pre === "less-loader"
          ? {
              lessOptions: {
                //ant 自定义主体配置颜色
                modifyVars: { "@primary-color": "#1DA57A" },
                javascriptEnabled: true,
              },
            }
          : {},
    },
  ].filter(Boolean);
};
module.exports = {
  entry: "./src/main.js",
  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction
      ? "static/js/[name].[contenthash:10].js"
      : "static/js/[name].js",
    chunkFilename: isProduction
      ? "static/js/[name].[contenthash:10].chunk.js"
      : "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      //处理css 兼容性问题
      //配合pack.json中的browserslist 来指定兼容性到什么成度
      {
        test: /\.css$/,
        use: getStyleloaders(),
      },
      {
        test: /\.less$/,
        use: getStyleloaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleloaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleloaders("stylus-loader"),
      },
      //处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, //一般来说10kb
          },
        },
      },
      {
        //处理其他资源
        test: /\.(wpff2?|ttf|map3|mp4)/,
        type: "asset/resource",
      },
      //处理js
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "../src"),
        loader: require.resolve("babel-loader"),
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          plugins: [!isProduction && "react-refresh/babel"].filter(Boolean), //激活js功能
        },
      },
    ],
  },
  //处理html
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
      }),
    isProduction &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "../public"),
            to: path.resolve(__dirname, "../dist"),
            globOptions: {
              //忽略index.html文件
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
    !isProduction && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  //开发模式
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: "all",
      cacheGroups: {
        //react  react-dom react-router-dom 一起打包成一个js文件
        react: {
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
          name: "chunk-react",
          priority: 40, //权重
        },
        //antd 单独打包
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: "chunk-antd",
          priority: 30, //权重
        },

        //剩下的node_modules 单独打包
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name: "chunk-libs",
          priority: 20, //权重
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    //是否需要压缩
    minimize: isProduction,
    minimizer: [
      new CssMinimizerWebpackPlugin(), //css压缩
      new TerserWebpackPlugin(), // js压缩
      new ImageMinimizerWebpackPlugin({
        minimizer: {
          implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }), //图片压缩
    ],
  },
  //webpack解析模块加载选项
  resolve: {
    //自动补齐文件扩展名
    extensions: [".jsx", ".js", ".json"],
  },
  devServer: {
    host: "localhost",
    port: 3300,
    open: true,
    hot: true, //开启HMR
    historyApiFallback: true, //解决报错404页面无法加载的问题
  },
  performance:false, //关闭性能分析，提升打包速度
};
