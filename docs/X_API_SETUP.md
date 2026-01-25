# 🐦 X (Twitter) API 連携ガイド

このガイドでは、X（Twitter）APIの認証情報を取得して、システムと連携する方法を説明します。

---

## 📋 必要なもの

- ✅ Xアカウント（投稿したいアカウント）
- ✅ 電話番号認証済みのアカウント
- ✅ メールアドレス

---

## 🚀 ステップ1: Twitter Developer Portalにアクセス

### 1-1. Developer Portalを開く

https://developer.twitter.com/en/portal/dashboard にアクセスします。

### 1-2. ログイン

Xアカウントでログインします。

### 1-3. 利用規約に同意

初めての場合、利用規約への同意が求められます。

---

## 🏗️ ステップ2: プロジェクトとアプリを作成

### 2-1. プロジェクトを作成

1. **「+ Create Project」**ボタンをクリック
2. プロジェクト名を入力
   - 例: `note投稿システム`
3. **「Next」**をクリック

### 2-2. 用途を選択

「What's your use case?」で用途を選択:
- **「Making a bot」**を選択（個人利用の場合）
- または **「Exploring the API」**
- **「Next」**をクリック

### 2-3. プロジェクトの説明

「Describe your project」で簡単な説明を入力:
- 例: `noteの記事をXに投稿するための個人用システム`
- **「Next」**をクリック

### 2-4. アプリを作成

1. アプリ名を入力
   - 例: `note-sns-app`
   - ⚠️ 注意: 一意の名前である必要があります
2. **「Complete」**をクリック

---

## 🔑 ステップ3: API KeyとSecretを取得

アプリ作成後、以下が表示されます:

```
API Key: xxxxxxxxxxxxxxxxxxxxxxxxx
API Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **重要: この画面は一度しか表示されません！**

### 保存方法

1. **「Copy」**ボタンをクリックして両方をコピー
2. メモ帳などに一時保存
3. または、スクリーンショットを撮る

保存したら **「Yes, I saved them」**をクリック

---

## ⚙️ ステップ4: アプリの権限を設定

### 4-1. アプリの設定画面を開く

1. ダッシュボードで作成したアプリをクリック
2. **「Settings」**タブをクリック

### 4-2. User authentication settingsを設定

1. **「Set up」**ボタンをクリック（User authentication settingsセクション）

2. **App permissions**を選択:
   - ✅ **「Read and Write」**を選択
   - （投稿するには書き込み権限が必要です）

3. **Type of App**を選択:
   - ✅ **「Web App, Automated App or Bot」**を選択

4. **App info**を入力:
   
   **Callback URI / Redirect URL:**
   ```
   http://localhost:3000
   ```
   
   **Website URL:**
   ```
   https://note.com/あなたのユーザー名
   ```
   （または任意のURL）

5. **「Save」**をクリック

---

## 🎫 ステップ5: Access TokenとSecretを生成

### 5-1. Keys and tokensタブを開く

1. アプリの設定画面で **「Keys and tokens」**タブをクリック

### 5-2. Access TokenとSecretを生成

1. **「Access Token and Secret」**セクションを探す
2. **「Generate」**ボタンをクリック

以下が表示されます:

```
Access Token: xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Access Token Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **重要: この画面も一度しか表示されません！**

### 保存方法

1. **両方をコピー**してメモ帳に保存
2. または、スクリーンショットを撮る

保存したら **「Yes, I saved them」**をクリック

---

## 📝 ステップ6: .envファイルに設定

取得した4つの認証情報を`.env`ファイルに設定します。

### 6-1. .envファイルを開く

プロジェクトフォルダの`.env`ファイルをテキストエディタで開きます。

### 6-2. 認証情報を入力

以下の部分を、取得した情報に置き換えます:

```env
# X (Twitter) API設定
X_API_KEY=ここにAPI Keyを貼り付け
X_API_SECRET=ここにAPI Secretを貼り付け
X_ACCESS_TOKEN=ここにAccess Tokenを貼り付け
X_ACCESS_SECRET=ここにAccess Token Secretを貼り付け
```

**例:**
```env
X_API_KEY=abc123XYZ456def789
X_API_SECRET=xyz789ABC123def456ghi789jkl012mno345pqr678stu901
X_ACCESS_TOKEN=1234567890-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
X_ACCESS_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGh
```

### 6-3. ファイルを保存

`.env`ファイルを保存します（Cmd+S）

---

## 🔄 ステップ7: サーバーを再起動

認証情報を設定したら、サーバーを再起動します:

### 方法1: start.commandを使用

1. `stop.command`をダブルクリックして停止
2. `start.command`をダブルクリックして起動

### 方法2: ターミナルを使用

1. ターミナルで `Ctrl+C` を押して停止
2. `npm start` で再起動

---

## ✅ ステップ8: 接続確認

1. ブラウザで `http://localhost:3000` を開く
2. 画面上部の **「X API」**バッジを確認
3. 🟢 **緑色の点**が表示されていれば接続成功！

---

## 🧪 ステップ9: テスト投稿

### 9-1. note記事を取得

1. 「🔄 note記事を取得」ボタンをクリック
2. 記事一覧が表示される

### 9-2. 投稿テスト

1. 任意の記事カードをクリック
2. 投稿確認モーダルが開く
3. X用投稿文を確認・編集
4. **「𝕏 Xに投稿」**ボタンをクリック

### 9-3. 確認

1. 「✅ Xへの投稿に成功しました！」と表示される
2. Xアカウントで投稿が確認できる

---

## ❌ トラブルシューティング

### エラー: "X API認証情報が設定されていません"

**原因:** `.env`ファイルの設定が正しくない

**解決方法:**
1. `.env`ファイルを開く
2. 4つの認証情報がすべて入力されているか確認
3. コピー&ペーストミスがないか確認
4. 余分なスペースや改行がないか確認

### エラー: "Xへの投稿に失敗しました"

**原因1:** アプリの権限が「Read and Write」になっていない

**解決方法:**
1. Developer Portalでアプリの設定を開く
2. User authentication settingsで「Read and Write」を選択
3. Access TokenとSecretを**再生成**
4. 新しいトークンを`.env`に設定

**原因2:** 投稿文が280文字を超えている

**解決方法:**
- 投稿文を280文字以内に編集

### ステータスバッジが灰色のまま

**原因:** サーバーを再起動していない

**解決方法:**
1. サーバーを再起動
2. ブラウザをリロード（Cmd+R）

---

## 📚 参考リンク

- **Twitter Developer Portal**: https://developer.twitter.com/en/portal/dashboard
- **API Documentation**: https://developer.twitter.com/en/docs/twitter-api
- **サポート**: https://twittercommunity.com/

---

## 🎉 完了！

これでXとの連携が完了しました！

noteの記事をワンクリックでXに投稿できるようになります。

---

**最終更新日:** 2026-01-22
