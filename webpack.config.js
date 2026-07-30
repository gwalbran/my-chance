const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff2?|eot|ttf|svg|png|jpe?g|gif)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
    ],
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    devServer: {
      static: './dist',
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
    performance: { hints: false },
  };
};
