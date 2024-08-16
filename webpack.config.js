const path = require('path');

module.exports = {
    // Cấu hình khác của Webpack
    module: {
        rules: [
            // Quy tắc khác
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
    },
    ignoreWarnings: [
        {
            module: /bootstrap\.min\.css$/,
            message: /Failed to parse source map/,
        },
    ],
    devServer: {
        historyApiFallback: true, // Thêm cấu hình này để hỗ trợ React Router
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            // Middleware trước khi thiết lập
            devServer.app.use((req, res, next) => {
                // Thêm middleware của bạn ở đây
                next();
            });

            // Middleware sau khi thiết lập
            devServer.app.use((req, res, next) => {
                // Thêm middleware của bạn ở đây
                next();
            });

            return middlewares;
        },
    },
};
