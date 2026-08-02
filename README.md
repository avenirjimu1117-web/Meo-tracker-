# MEO順位トラッカー

Arbre et chimie Group向けのMEO(Googleマップ)順位確認ダッシュボード。
GASバックエンド(Code.gs)から順位データを取得して表示するVite+Reactアプリ。

## セットアップ

1. `npm install`
2. `.env.example` を `.env` にコピーし、GASウェブアプリのURLを設定
3. `npm run dev` でローカル確認 / `npm run build` でビルド

## Vercelへのデプロイ

1. このフォルダをGitHubリポジトリにpush (または `vercel` CLIで直接デプロイ)
2. Vercelプロジェクト作成時にFrameworkは "Vite" を選択
3. Project Settings > Environment Variables に
   `VITE_GAS_API_URL` = GASウェブアプリのURL を追加
4. Deploy

## 画面構成

- ダッシュボード: 店舗ごとの現在順位(バッジ)と直近90日の推移グラフ、今すぐチェック実行ボタン
- エリア設定: 店舗の住所・エリア名・Googleビジネス名を編集
- キーワード: 店舗ごとのキーワード一覧、有効/無効切替、新規追加
