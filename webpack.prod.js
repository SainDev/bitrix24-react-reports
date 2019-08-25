const webpack = require('webpack');
const merge = require('webpack-merge');
const MinifyPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
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
        new CopyWebpackPlugin([
            { from: 'src/assets', to: 'assets' },
        ]),
        new ManifestPlugin({
            fileName: 'asset-manifest.json', // Not to confuse with manifest.json
        }),
        new SWPrecacheWebpackPlugin({
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
                if (message.indexOf('Total precache size is') === 0) {
                    // This message occurs for every build and is a bit too noisy.
                    return;
                }
                console.log(message);
            },
            minify: true, // minify and uglify the script
            navigateFallback: '/index.html',
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
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
        })
    ],
});