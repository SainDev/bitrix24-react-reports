const webpack = require('webpack');
const merge = require('webpack-merge');
const MinifyPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    stats: {
        colors: false,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: true,
    },
    optimization: {
        minimizer: [
            new MinifyPlugin({
                sourceMap: true,
                terserOptions: {
                    compress: {
                        inline: false
                    }
                }
            })
        ],
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor_app',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'React Tasks SD',
            template: 'src/html/index.html',
            'meta': {
                'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
});