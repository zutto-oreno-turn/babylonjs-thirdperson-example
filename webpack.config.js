module.exports = {
  mode: 'development',
  entry: {
    bundle: './src/main.ts'
  },
  output: {
    path: `${__dirname}/public/assets/js`,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'esbuild-loader'
      }
    ]
  },
  devServer: {
    static: `${__dirname}/public`
  }
}
