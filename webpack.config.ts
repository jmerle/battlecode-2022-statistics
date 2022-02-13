import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

const config: webpack.Configuration & webpackDevServer.Configuration = {
  entry: {
    main: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: isProduction ? 'source-map' : 'eval',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: 'vendor',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Battlecode 2022 Statistics',
    }),
  ],
};

export default config;
