const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
    mode: 'development',
    entry: "./src/index.js",
    watch: true,
    output: {
        //path: path.join(__dirname, 'dist'),
        path: path.resolve(process.cwd(), 'dist'),
        //publicPath: '/dist/',
        filename: "main.js",
        chunkFilename: '[name].bundle.js'
    },
    //devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        //inline: true,
        //host: 'localhost',
        port: 9000,
        watchContentBase: true,
        progress: true
    },
    plugins: [
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
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            //modules: true, //bootstrap не пашет
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
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css', '.scss']
    }
};