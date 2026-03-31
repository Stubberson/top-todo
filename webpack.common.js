// Basic Webpack configure settings with HTML and CSS
import path from "node:path"
import HtmlWebpackPlugin from "html-webpack-plugin"

export default {
  entry: {
    app: "./src/index.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  }
}