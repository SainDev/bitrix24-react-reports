const webpack = require('webpack');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        //publicPath: './',
        filename: 'main.js',
        chunkFilename: '[name].bundle.js'
    },
    plugins: [
        new MomentLocalesPlugin({
            localesToKeep: ['ru'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                loader: 'babel-loader',
                query: {
                    presets: [
                        ["@babel/env", {
                            "targets": {
                                "browsers": "last 2 chrome versions"
                            }
                        }]
                    ]
                }
            },
            {
                test: /\.(scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            //sourceMap: true,
                            //minimize: true,
                            //url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    //outputPath: 'assets',
                },
            }
        ]
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css', '.scss']
    }
};