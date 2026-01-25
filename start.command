#!/bin/bash

# note SNS投稿支援システム 起動スクリプト

# スクリプトのディレクトリに移動
cd "$(dirname "$0")"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 note SNS投稿支援システム"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 サーバーを起動しています..."
echo ""

# Node.jsがインストールされているか確認
if ! command -v node &> /dev/null; then
    echo "❌ エラー: Node.jsがインストールされていません"
    echo "   https://nodejs.org/ からインストールしてください"
    echo ""
    read -p "Enterキーを押して終了..."
    exit 1
fi

# node_modulesがあるか確認
if [ ! -d "node_modules" ]; then
    echo "📦 初回起動: 依存関係をインストールしています..."
    npm install
    echo ""
fi

# .envファイルがあるか確認
if [ ! -f ".env" ]; then
    echo "⚠️  警告: .envファイルが見つかりません"
    echo "   .env.exampleをコピーして.envを作成します..."
    cp .env.example .env
    echo "   ✅ .envファイルを作成しました"
    echo ""
    echo "📝 次のステップ:"
    echo "   1. .envファイルを開いてAPI認証情報を設定してください"
    echo "   2. このスクリプトを再度実行してください"
    echo ""
    read -p "Enterキーを押して.envファイルを開く..."
    open .env
    exit 0
fi

echo "✅ 準備完了"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 ブラウザで以下のURLを開いてください:"
echo "   http://localhost:3000"
echo ""
echo "⏹  停止するには: Ctrl+C を押してください"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ブラウザを自動的に開く
sleep 2
open http://localhost:3000

# サーバーを起動
npm start
