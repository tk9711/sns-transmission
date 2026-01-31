const axios = require('axios');

/**
 * note記事取得サービス
 */
class NoteService {
    constructor() {
        this.rssUrl = process.env.NOTE_RSS_URL;
    }

    /**
     * RSS/APIから記事一覧を取得
     * @returns {Promise<Array>} - 記事データの配列
     */
    async getArticles() {
        try {
            if (!this.rssUrl) {
                throw new Error('NOTE_RSS_URLが設定されていません');
            }

            // RSSフィードを取得
            const response = await axios.get(this.rssUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            // XMLをパース（簡易実装）
            const articles = this.parseRSS(response.data);

            return articles;
        } catch (error) {
            console.error('note記事取得エラー:', error.message);
            throw new Error(`note記事の取得に失敗しました: ${error.message}`);
        }
    }

    /**
     * 特定記事の詳細を取得
     * @param {string} articleId - 記事ID
     * @returns {Promise<Object>} - 記事データ
     */
    async getArticle(articleId) {
        try {
            const articles = await this.getArticles();
            const article = articles.find(a => a.id === articleId);

            if (!article) {
                throw new Error('記事が見つかりません');
            }

            return article;
        } catch (error) {
            console.error('note記事詳細取得エラー:', error.message);
            throw error;
        }
    }

    /**
     * RSS XMLを簡易パース
     * @param {string} xml - RSS XML文字列
     * @returns {Array} - パースされた記事配列
     */
    parseRSS(xml) {
        const articles = [];

        // <item>タグを抽出
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null) {
            const itemXml = match[1];

            // 各フィールドを抽出
            const title = this.extractTag(itemXml, 'title');
            const link = this.extractTag(itemXml, 'link');
            const description = this.extractTag(itemXml, 'description');
            const pubDate = this.extractTag(itemXml, 'pubDate');
            const guid = this.extractTag(itemXml, 'guid');

            // サムネイル画像を抽出
            // noteのRSSでは<media:thumbnail>タグの中身がURL
            let thumbnail = this.extractTag(itemXml, 'media:thumbnail');

            if (!thumbnail) {
                thumbnail = this.extractAttribute(itemXml, 'enclosure', 'url');
            }

            // クエリパラメータを除去して高画質版（オリジナル）を取得
            if (thumbnail) {
                thumbnail = thumbnail.split('?')[0];
            }

            // 記事IDを生成（guidまたはlinkから）
            const id = guid || link;

            articles.push({
                id: this.generateArticleId(id),
                title: this.decodeHTML(title),
                url: link,
                excerpt: this.decodeHTML(this.stripHTML(description)),
                thumbnail: thumbnail || '',
                publishedAt: new Date(pubDate).toISOString()
            });
        }

        return articles;
    }

    /**
     * XMLタグから内容を抽出
     */
    extractTag(xml, tagName) {
        const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
        const match = xml.match(regex);
        return match ? match[1].trim() : '';
    }

    /**
     * XMLタグの属性を抽出
     */
    extractAttribute(xml, tagName, attrName) {
        const regex = new RegExp(`<${tagName}[^>]*${attrName}=["']([^"']*)["']`, 'i');
        const match = xml.match(regex);
        return match ? match[1] : '';
    }

    /**
     * HTMLタグを除去
     */
    stripHTML(html) {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    /**
     * HTMLエンティティをデコード
     */
    decodeHTML(text) {
        const entities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&nbsp;': ' '
        };

        return text.replace(/&[^;]+;/g, match => entities[match] || match);
    }

    /**
     * URLから記事IDを生成
     */
    generateArticleId(url) {
        // URLの最後の部分をIDとして使用
        const match = url.match(/\/n\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : url.split('/').pop();
    }
}

module.exports = new NoteService();
