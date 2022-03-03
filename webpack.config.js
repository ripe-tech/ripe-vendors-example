const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ZipPlugin = require("zip-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const info = require(path.resolve(__dirname, "package.json"));
const name = path.parse(__dirname).name;
const version = info.version;

module.exports = (env, argv) => {
    const fileSuffix = process.env.DEPLOYMENT === "serverless" ? "?[hash]" : "";
    const publicUrl = process.env.PUBLIC_URL;
    const publicPath = `${
        process.env.DEPLOYMENT === "serverless"
            ? publicUrl || "@@PUBLIC_PATH@@"
            : `/plugins/${name}`
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
                    type: "asset/resource",
                    generator: {
                        filename: () => {
                            return `[path][name][ext]?${fileSuffix}`;
                        },
                        publicPath: publicPath
                    }
                },
                {
                    resourceQuery: /raw/,
                    type: "asset/source"
                },
                {
                    test: /plugin\.json$/,
                    type: "asset/resource",
                    generator: {
                        filename: () => {
                            return `[name][ext]?${fileSuffix}`;
                        }
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
