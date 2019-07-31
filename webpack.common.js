const path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        //path: path.join(__dirname, 'dist'),
        path: path.resolve(__dirname, 'dist'),
        //publicPath: '/dist/',
        filename: "main.js",
        chunkFilename: '[name].bundle.js'
    },
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