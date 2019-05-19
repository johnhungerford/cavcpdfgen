module.exports = [
  {
    entry: "./src/main.js",
    output: {
        path: __dirname + '/public/javascripts/',
        filename: "app.js"
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loader: 'style-loader',
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          }
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          }
        }
      ]
    }
  },
]
  