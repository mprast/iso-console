var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

var path = require("path");
module.exports = {
    entry: path.resolve("./src/entry_point.tsx"),
    devtool: "source-map",
    module: {
        loaders: [
            { test: /\.tsx?$/, exclude: /node_modules/, loader: "awesome-typescript-loader" },
            { 
              test: /\.css$/,
              exclude: /node_modules/,
              loader: "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&camelCase=dashes"
            }
        ]
    },
    resolve: {
        alias: {
            // allows us to behave as if we live
            // in react land; even though we are 
            // really using Preact behind the 
            // scenes. The alias extends to 
            // dependencies (e.g. react-motion) 
            // as well.
            "react": "preact-compat",
            "react-dom": "preact-compat"
        },
        modules: [
            path.resolve("."),
            "node_modules"
        ],
        extensions: [".ts", ".tsx", ".css", ".js", ".jsx", ".json"]
    },
    plugins: [
        new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt')
    ],
    output: {
        filename: "bundle.js",
        chunkFilename: "[id].bundle.js",
        path: path.resolve("./public/javascripts"),
        publicPath: "http://localhost:3000/javascripts/"
    }
};
