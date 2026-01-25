const axios = require('axios');

/**
 * Instagram Graph API連携サービス
 */
class InstagramService {
    constructor() {
        this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
        this.businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
        this.apiUrl = 'https://graph.facebook.com/v18.0';
    }

    /**
     * Instagram投稿を実行
     * @param {string} imageUrl - 投稿する画像のURL
     * @param {string} caption - キャプション
     * @returns {Promise<Object>} - 投稿結果
     */
    async postToFeed(imageUrl, caption) {
        try {
            // API認証情報チェック
            if (!this.accessToken || !this.businessAccountId) {
                throw new Error('Instagram API認証情報が設定されていません');
            }

            // ステップ1: メディアコンテナを作成
            const containerId = await this.createMediaContainer(imageUrl, caption);

            console.log(`Media Container Created: ${containerId}. Waiting for processing...`);

            // Instagram側の処理待ち（15秒）
            // 画像のダウンロードと処理に時間がかかる場合があるため
            await new Promise(resolve => setTimeout(resolve, 15000));

            // ステップ2: メディアを公開
            const result = await this.publishMedia(containerId);

            return {
                success: true,
                data: result,
                message: 'Instagramへの投稿に成功しました'
            };
        } catch (error) {
            console.error('Instagram投稿エラー:', error.response?.data || error.message);

            let errorMessage = 'Instagramへの投稿に失敗しました';
            if (error.response?.data?.error?.message) {
                errorMessage += `: ${error.response.data.error.message}`;
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * メディアコンテナを作成
     * @param {string} imageUrl - 画像URL
     * @param {string} caption - キャプション
     * @returns {Promise<string>} - コンテナID
     */
    async createMediaContainer(imageUrl, caption) {
        try {
            const url = `${this.apiUrl}/${this.businessAccountId}/media`;

            const response = await axios.post(url, null, {
                params: {
                    image_url: imageUrl,
                    caption: caption,
                    access_token: this.accessToken
                }
            });

            if (!response.data.id) {
                throw new Error('メディアコンテナの作成に失敗しました');
            }

            return response.data.id;
        } catch (error) {
            console.error('メディアコンテナ作成エラー:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * メディアを公開
     * @param {string} containerId - コンテナID
     * @returns {Promise<Object>} - 公開結果
     */
    async publishMedia(containerId) {
        try {
            const url = `${this.apiUrl}/${this.businessAccountId}/media_publish`;

            const response = await axios.post(url, null, {
                params: {
                    creation_id: containerId,
                    access_token: this.accessToken
                }
            });

            return response.data;
        } catch (error) {
            console.error('メディア公開エラー:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * API接続テスト
     * @returns {Promise<boolean>} - 接続成功可否
     */
    async testConnection() {
        try {
            if (!this.accessToken || !this.businessAccountId) {
                return false;
            }

            const url = `${this.apiUrl}/${this.businessAccountId}`;
            await axios.get(url, {
                params: {
                    fields: 'id,username',
                    access_token: this.accessToken
                }
            });

            return true;
        } catch (error) {
            console.error('Instagram接続テストエラー:', error.response?.data || error.message);
            return false;
        }
    }

    /**
     * アカウント情報を取得
     * @returns {Promise<Object>} - アカウント情報
     */
    async getAccountInfo() {
        try {
            const url = `${this.apiUrl}/${this.businessAccountId}`;
            const response = await axios.get(url, {
                params: {
                    fields: 'id,username,name,profile_picture_url',
                    access_token: this.accessToken
                }
            });

            return response.data;
        } catch (error) {
            console.error('アカウント情報取得エラー:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new InstagramService();
