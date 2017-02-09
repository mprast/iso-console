var path = require("path");
module.exports = {
    entry: path.resolve("./components/root.js"),
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { 
              test: /\.css$/,
              exclude: /node_modules/,
              loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve("."),
            "node_modules"
        ] 
    },
    output: {
        filename: "bundle.js",
        chunkFilename: "[id].bundle.js",
        path: path.resolve("./public/javascripts"),
        publicPath: "http://localhost:3000/javascripts/"
    }
};
