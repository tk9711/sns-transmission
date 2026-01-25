const axios = require('axios');
const crypto = require('crypto');

/**
 * X (Twitter) API連携サービス
 */
class XService {
    constructor() {
        this.apiKey = process.env.X_API_KEY;
        this.apiSecret = process.env.X_API_SECRET;
        this.accessToken = process.env.X_ACCESS_TOKEN;
        this.accessSecret = process.env.X_ACCESS_SECRET;
        this.apiUrl = 'https://api.twitter.com/2/tweets';
    }

    /**
     * ツイートを投稿
     * @param {string} text - 投稿テキスト（280文字以内）
     * @returns {Promise<Object>} - 投稿結果
     */
    async postTweet(text) {
        try {
            // API認証情報チェック
            if (!this.apiKey || !this.apiSecret || !this.accessToken || !this.accessSecret) {
                throw new Error('X API認証情報が設定されていません');
            }

            // 文字数チェック
            if (text.length > 280) {
                throw new Error('ツイートは280文字以内である必要があります');
            }

            // OAuth 1.0a署名を生成
            const oauth = this.generateOAuthHeader('POST', this.apiUrl);

            // API呼び出し
            const response = await axios.post(
                this.apiUrl,
                { text },
                {
                    headers: {
                        'Authorization': oauth,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                data: response.data,
                message: 'Xへの投稿に成功しました'
            };
        } catch (error) {
            console.error('X投稿エラー:', error.response?.data || error.message);

            // エラーメッセージを整形
            let errorMessage = 'Xへの投稿に失敗しました';
            if (error.response?.data?.detail) {
                errorMessage += `: ${error.response.data.detail}`;
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * OAuth 1.0a認証ヘッダーを生成
     * @param {string} method - HTTPメソッド
     * @param {string} url - リクエストURL
     * @returns {string} - Authorizationヘッダー
     */
    generateOAuthHeader(method, url) {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = crypto.randomBytes(32).toString('base64').replace(/\W/g, '');

        const params = {
            oauth_consumer_key: this.apiKey,
            oauth_token: this.accessToken,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: timestamp,
            oauth_nonce: nonce,
            oauth_version: '1.0'
        };

        // 署名ベース文字列を作成
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        const signatureBase = [
            method.toUpperCase(),
            encodeURIComponent(url),
            encodeURIComponent(paramString)
        ].join('&');

        // 署名キーを作成
        const signingKey = `${encodeURIComponent(this.apiSecret)}&${encodeURIComponent(this.accessSecret)}`;

        // HMAC-SHA1署名を生成
        const signature = crypto
            .createHmac('sha1', signingKey)
            .update(signatureBase)
            .digest('base64');

        params.oauth_signature = signature;

        // Authorizationヘッダーを構築
        const authHeader = 'OAuth ' + Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(params[key])}"`)
            .join(', ');

        return authHeader;
    }

    /**
     * API接続テスト
     * @returns {Promise<boolean>} - 接続成功可否
     */
    async testConnection() {
        try {
            if (!this.apiKey || !this.apiSecret || !this.accessToken || !this.accessSecret) {
                return false;
            }

            // 実際のAPI疎通確認（ユーザー情報取得）
            const url = 'https://api.twitter.com/2/users/me';
            const oauth = this.generateOAuthHeader('GET', url);

            await axios.get(url, {
                headers: {
                    'Authorization': oauth
                }
            });

            return true;
        } catch (error) {
            console.error('X接続テストエラー:', error.response?.data || error.message);
            return false;
        }
    }
}

module.exports = new XService();
