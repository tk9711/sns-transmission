require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // Use 3001 to avoid conflict with main app

// ---------------------------------------------------------
// 設定: ここにあなたの App ID と App Secret を入力してもらうことを想定
// 環境変数から読むか、コードに直接書いてもらう形にします
// ---------------------------------------------------------
const APP_ID = process.env.FB_APP_ID || 'YOUR_APP_ID';
const APP_SECRET = process.env.FB_APP_SECRET || 'YOUR_APP_SECRET';
const REDIRECT_URI = `http://localhost:${port}/auth/callback`;

// 必要な権限
const SCOPE = 'pages_show_list,instagram_basic,instagram_content_publish,pages_read_engagement,public_profile';

app.get('/', (req, res) => {
    if (APP_ID === 'YOUR_APP_ID') {
        return res.send(`
            <h1>設定が必要です</h1>
            <p>1. .envファイルに以下を追加してください:</p>
            <pre>
FB_APP_ID=あなたのアプリID
FB_APP_SECRET=あなたのアプリシークレット
            </pre>
            <p>2. Meta for Developers > アプリ設定 > ベーシック で確認できます。</p>
            <p>3. 設定後、サーバーを再起動してください。</p>
        `);
    }

    // FacebookログインURLを生成 (rerequestを追加して、拒否された権限を再度尋ねる)
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&state=insta_setup&scope=${SCOPE}&auth_type=rerequest`;

    res.send(`
        <h1>Instagram API トークン取得ツール by Antigravity</h1>
        <p>以下のボタンを押して、Facebookでログインし、ページへのアクセスを許可してください。</p>
        <a href="${authUrl}" style="background-color: #1877f2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Facebookでログインしてトークンを取得</a>
        <br><br>
        <p>⚠️ 注意: 認証画面で「許可するページ」を聞かれたら、必ず【すべてのページ】を選択してください。</p>
    `);
});

app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.send('エラー: 認証コードが取得できませんでした。');
    }

    try {
        // コードをトークンに交換
        const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: APP_ID,
                redirect_uri: REDIRECT_URI,
                client_secret: APP_SECRET,
                code: code
            }
        });

        const shortLivedToken = tokenRes.data.access_token;
        console.log('Short-lived Token:', shortLivedToken);

        // 長期トークンに交換（推奨）
        const longTokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: APP_ID,
                client_secret: APP_SECRET,
                fb_exchange_token: shortLivedToken
            }
        });

        const longLivedToken = longTokenRes.data.access_token || shortLivedToken;

        // ページ一覧を取得して検証
        const pagesRes = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
            params: {
                access_token: longLivedToken,
                fields: 'name,id,access_token,instagram_business_account{id,username}'
            }
        });

        const pages = pagesRes.data.data;

        let html = `
            <h1>🎉 トークン取得成功！</h1>
            <p>以下のトークンを .env ファイルの <code>INSTAGRAM_ACCESS_TOKEN</code> にコピーしてください。</p>
            
            <h3>ユーザーアクセストークン (有効期限: 約60日)</h3>
            <textarea style="width: 100%; height: 80px; margin-bottom: 20px;">${longLivedToken}</textarea>
            
            <h2>検出されたページ (${pages.length}件):</h2>
            <p>※ <b>ページアクセストークン</b>を使用すると、有効期限が無期限になります（推奨）。</p>
            <ul>
        `;

        pages.forEach(p => {
            const connectStatus = p.instagram_business_account
                ? `✅ Instagramリンク済み (ID: ${p.instagram_business_account.id})`
                : '❌ Instagram未リンク';

            const color = p.instagram_business_account ? 'green' : 'red';
            const pageTokenHtml = p.access_token
                ? `<div><small>ページアクセストークン (無期限):</small><br><textarea style="width: 100%; height: 60px;">${p.access_token}</textarea></div>`
                : '';

            html += `
                <li style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                    <div style="font-size: 1.2em; font-weight: bold;">${p.name} <span style="font-size: 0.8em; color: gray;">(ID: ${p.id})</span></div>
                    <div style="color:${color}; margin: 5px 0;">${connectStatus}</div>
                    ${pageTokenHtml}
                </li>`;
        });

        html += '</ul>';

        if (pages.length === 0) {
            html += `
                <h3 style="color:red">⚠️ ページが見つかりません！</h3>
                <p>ログイン時のポップアップで、ページのチェックを外していませんか？</p>
                <p>もう一度 <a href="/">最初からやり直してください</a>。</p>
            `;
        }

        res.send(html);

    } catch (error) {
        console.error(error);
        res.send(`<h1>エラーが発生しました</h1><p>${error.response?.data?.error?.message || error.message}</p>`);
    }
});

app.listen(port, () => {
    console.log(`\n🤖 Auth Tool Running: http://localhost:${port}`);
    console.log(`Please verify FB_APP_ID and FB_APP_SECRET in .env are set.`);
});
