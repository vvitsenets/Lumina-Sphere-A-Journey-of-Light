const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	devtool: "source-map",
	entry: path.join(__dirname, "src/index.ts"),
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: 'index.js',
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: ['node_modules', 'src'],
		plugins: [new TsconfigPathsPlugin({extensions: [".ts", ".js", ".json"]})]
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'ts-loader',
			exclude: /node_modules/,
		}]
	}
};