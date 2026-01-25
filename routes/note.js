const express = require('express');
const router = express.Router();
const noteService = require('../services/noteService');

/**
 * GET /api/note/articles
 * note記事一覧を取得
 */
router.get('/articles', async (req, res) => {
    try {
        const articles = await noteService.getArticles();

        res.json({
            success: true,
            data: articles,
            count: articles.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/note/article/:id
 * 特定のnote記事詳細を取得
 */
router.get('/article/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await noteService.getArticle(id);

        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
