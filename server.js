require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const noteRoutes = require('./routes/note');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ルーティング
app.use('/api/note', noteRoutes);
app.use('/api/post', postRoutes);

// ルートパス
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'サーバーエラーが発生しました',
    message: err.message 
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`📝 note SNS投稿支援システム`);
});
