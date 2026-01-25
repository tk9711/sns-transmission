const express = require('express');
const router = express.Router();
const { generatePosts } = require('../utils/postGenerator');
const xService = require('../services/xService');
const instagramService = require('../services/instagramService');

/**
 * POST /api/post/generate
 * 投稿文を自動生成
 */
router.post('/generate', async (req, res) => {
    try {
        const { article } = req.body;

        if (!article || !article.title || !article.url) {
            return res.status(400).json({
                success: false,
                error: '記事データが不正です'
            });
        }

        const posts = generatePosts(article);

        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/post/x
 * Xへ投稿
 */
router.post('/x', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: '投稿テキストが指定されていません'
            });
        }

        const result = await xService.postTweet(text);

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/post/instagram
 * Instagramへ投稿
 */
router.post('/instagram', async (req, res) => {
    try {
        const { imageUrl, caption } = req.body;

        if (!imageUrl || !caption) {
            return res.status(400).json({
                success: false,
                error: '画像URLまたはキャプションが指定されていません'
            });
        }

        const result = await instagramService.postToFeed(imageUrl, caption);

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/post/status
 * API接続状態を確認
 */
router.get('/status', async (req, res) => {
    try {
        const xConnected = await xService.testConnection();
        const instagramConnected = await instagramService.testConnection();

        res.json({
            success: true,
            data: {
                x: xConnected,
                instagram: instagramConnected
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
