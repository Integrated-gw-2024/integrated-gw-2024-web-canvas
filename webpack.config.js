module.exports = {
  mode: 'development',
  entry: './source/main.ts',

  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: [
      '.ts', '.js',
    ],
  },

  output: {
    path: `${__dirname}/dist`,
    filename: 'main.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        include: __dirname
      }
    ]
  },

  stats: {
    children: true,
  },
};
