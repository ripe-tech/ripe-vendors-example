const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ZipPlugin = require("zip-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const info = require(path.resolve(__dirname, "package.json"));
const name = path.parse(__dirname).name;
const version = info.version;

module.exports = (env, argv) => {
    const fileSuffix = argv.deployment === "serverless" ? "?[hash]" : "";
    const publicPath = `${
        argv.deployment === "serverless" ? "@@PUBLIC_PATH@@" : `/plugins/${name}`
    }`;
    return {
        entry: path.resolve(__dirname, "index.js"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js",
            library: `RipeCommons.plugins.${name}`,
            libraryTarget: "umd",
            umdNamedDefine: true
        },
        mode: "development",
        optimization: {
            concatenateModules: false,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_fnames: true,
                        keep_classnames: true
                    }
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
                {
                    test: /\.js$/,
                    exclude: "/node_modules/",
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-syntax-dynamic-import"]
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: "vue-style-loader" },
                        {
                            loader: "css-loader",
                            options: {
                                esModule: false
                            }
                        }
                    ]
                },
                {
                    test: /\.(jpg|png|svg)$/,
                    loader: "file-loader",
                    options: {
                        name: `[path][name].[ext]${fileSuffix}`,
                        publicPath: publicPath,
                        esModule: false
                    }
                },
                {
                    test: /plugin\.json$/,
                    loader: "file-loader",
                    type: "javascript/auto",
                    options: {
                        name: `[name].[ext]${fileSuffix}`,
                        esModule: false
                    }
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new ZipPlugin({
                path: "rrp",
                filename: `${name}.${version}`,
                extension: "rrp"
            })
        ]
    };
};
