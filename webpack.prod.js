const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MinifyPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CnameWebpackPlugin = require('cname-webpack-plugin');
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
                    name: 'vendor',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                PUBLIC_URL: JSON.stringify('/')
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
            ],
        }),
        new HtmlWebpackPlugin({
            title: 'Отчеты SainDev',
            template: require('path').resolve(__dirname, 'src/html', 'index.html'),
            filename: './index.html',
            'meta': {
                'mobile-web-app-capable': 'yes',
                'apple-mobile-web-app-capable': 'yes',
                'application-name': 'Отчеты SainDev',
                'apple-mobile-web-app-title': 'Отчеты SainDev',
                'msapplication-starturl': '/',
                'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
            }
        }),
        new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            offlineGoogleAnalytics: true,
            navigateFallback: '/index.html',
        }),
        new CnameWebpackPlugin({
            domain: 'report.saindev.ru',
        }),
    ],
});