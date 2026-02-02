# 📝 note SNS投稿支援システム

note記事からInstagramとXへ半自動投稿できるWebアプリケーションです。

## ✨ 機能

- 📚 note記事の一覧取得
- 🤖 SNS投稿文の自動生成
- ✏️ 投稿前の確認・編集
- 𝕏 Xへの即時投稿
- 📷 Instagramへの即時投稿
- 🎨 モダンでプレミアムなUI

## ⚡ クイックスタート

```bash
git clone https://github.com/tk9711/sns-transmission.git
cd sns-transmission
```

**Mac:** `start.command` をダブルクリック  
**Windows:** `start.bat` をダブルクリック

> 初回起動時は自動で依存関係のインストールと `.env` ファイルの作成が行われます。
> `.env` ファイルにAPI認証情報を入力後、再度スクリプトを実行してください。

## 🚀 セットアップ（詳細）

### 0. Node.jsのインストール

このアプリケーションには **Node.js v18以上** が必要です。

**Mac:**

1. [Homebrew](https://brew.sh/) がインストールされている場合:
   ```bash
   brew install node
   ```

2. または [Node.js公式サイト](https://nodejs.org/) からmacOS用インストーラーをダウンロードして実行

**Windows:**

1. [Node.js公式サイト](https://nodejs.org/) にアクセス
2. 「LTS」版（推奨）をダウンロード
3. ダウンロードした `.msi` ファイルを実行してインストール
4. インストール完了後、コマンドプロンプトで確認:
   ```cmd
   node --version
   ```

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成します：

```bash
cp .env.example .env
```

`.env` ファイルを編集して、各API認証情報を設定してください：

```env
# note設定
NOTE_RSS_URL=https://note.com/your_username/rss

# X (Twitter) API設定
X_API_KEY=your_x_api_key
X_API_SECRET=your_x_api_secret
X_ACCESS_TOKEN=your_x_access_token
X_ACCESS_SECRET=your_x_access_secret

# Instagram Graph API設定
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id

# サーバー設定
PORT=3000

# 認証設定（ログイン用）
APP_USER=admin
APP_PASSWORD=password
SESSION_SECRET=your_random_secret_string
```

> [!IMPORTANT]
> 公開環境では必ず認証設定を行い、推測されにくいユーザー名・パスワード・SESSION_SECRETを設定してください。


### 3. サーバーの起動

**Mac/Linux:**
```bash
npm start
```
または `start.command` をダブルクリック

**Windows:**
`start.bat` をダブルクリック

ブラウザで `http://localhost:3000` にアクセスしてください。

### 4. サーバーの停止

**Mac/Linux:** `Ctrl+C` または `stop.command` をダブルクリック

**Windows:** `Ctrl+C` または `stop.bat` をダブルクリック

## 🔑 API認証情報の取得方法

### note RSS URL

1. noteのプロフィールページにアクセス
2. URLの末尾に `/rss` を追加
3. 例: `https://note.com/your_username/rss`

### X (Twitter) API

1. [Twitter Developer Portal](https://developer.twitter.com/) にアクセス
2. プロジェクトとアプリを作成
3. OAuth 1.0a認証情報を取得
4. Read and Write権限を有効化

### Instagram Graph API

> [!IMPORTANT]
> Instagram Graph APIは**Instagramビジネスアカウント**が必要です。個人アカウントでは利用できません。

1. [Meta for Developers](https://developers.facebook.com/) でアプリを作成
2. Instagram Graph APIを追加
3. FacebookページとInstagramビジネスアカウントを連携
4. アクセストークンとビジネスアカウントIDを取得

詳細は[Instagram Graph API公式ドキュメント](https://developers.facebook.com/docs/instagram-api/)を参照してください。

## 📁 プロジェクト構成

```
SNStransmission/
├── server.js              # Expressサーバー
├── routes/
│   ├── note.js           # note記事取得API
│   └── post.js           # SNS投稿API
├── services/
│   ├── noteService.js    # note API連携
│   ├── xService.js       # X API連携
│   └── instagramService.js # Instagram API連携
├── utils/
│   └── postGenerator.js  # 投稿文自動生成
├── public/
│   ├── index.html        # メインHTML
│   ├── css/
│   │   └── style.css     # スタイルシート
│   └── js/
│       └── app.js        # フロントエンドロジック
├── package.json
├── .env.example          # 環境変数テンプレート
└── README.md
```

## 🎯 使い方

1. **記事を取得**: 「note記事を取得」ボタンをクリック
2. **記事を選択**: 投稿したい記事カードをクリック
3. **投稿文を確認**: 自動生成された投稿文を確認・編集
4. **投稿実行**: 「Xに投稿」または「Instagramに投稿」ボタンをクリック

## ⚠️ トラブルシューティング

### note記事が取得できない

- `.env` ファイルの `NOTE_RSS_URL` が正しいか確認
- noteのRSSフィードが公開されているか確認

### X投稿が失敗する

- X API認証情報が正しいか確認
- アプリの権限が「Read and Write」になっているか確認
- 投稿文が280文字以内か確認

### Instagram投稿が失敗する

- Instagramビジネスアカウントを使用しているか確認
- アクセストークンが有効か確認
- 画像URLが公開アクセス可能か確認

## 🔮 将来の拡張予定

- ⏰ 予約投稿機能
- 🤖 完全自動投稿
- 📊 投稿分析・レポート
- 🎨 画像生成・加工機能

## 🌍 インターネット上での運用（デプロイ）

このアプリケーションをインターネット上で公開するには、以下のサービスがおすすめです。

### 推奨: Render.com（無料枠あり）

最も簡単にデプロイできる方法です。

1. [Render.com](https://render.com/) に登録
2. 「New +」ボタンから **「Web Service」** を選択
3. **「Build and deploy from a Git repository」** を選択
4. GitHubと連携し、このリポジトリ（`sns-transmission`）を選択
5. 設定画面で以下を入力:
   - **Name**: アプリ名（例: `my-sns-app`）
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Environment Variables** (環境変数) セクションで以下を追加:
   - `NOTE_RSS_URL`
   - `X_API_KEY` 等、`.env` にある値をすべてコピーして入力
7. **Create Web Service** をクリック

数分でデプロイが完了し、発行されたURL（例: `https://my-sns-app.onrender.com`）からアクセスできるようになります。

> [!WARNING]
> インターネット上に公開する場合は、`X_API_KEY` などの秘密情報が漏洩しないよう十分注意してください。
> また、Basic認証などのアクセス制限をかけることを強く推奨します。

## 📄 ライセンス

MIT License

## 🙋 サポート

問題が発生した場合は、以下を確認してください：

1. Node.jsのバージョン（推奨: v16以上）
2. `.env` ファイルの設定
3. API認証情報の有効性
4. ネットワーク接続

---

Made with ❤️ for note creators
