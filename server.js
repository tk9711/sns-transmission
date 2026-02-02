require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const noteRoutes = require('./routes/note');
const postRoutes = require('./routes/post');

const app = express();

// Render.comなどのプロキシ環境でCookie/Sessionを正しく動作させる設定
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// セッション設定
app.use(session({
  name: 'sns_app_sid', // クッキー名を変更して古いセッションと分離
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // 本番環境（HTTPS）ではtrueにする
    // maxAge: 24 * 60 * 60 * 1000 // 永続化を無効化（ブラウザを閉じるとログアウト）
  }
}));

// 認証チェックミドルウェア
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }

  // APIリクエストの場合は401エラー
  if (req.path.startsWith('/api/') && !req.path.startsWith('/api/auth/')) {
    return res.status(401).json({ success: false, error: '認証が必要です' });
  }

  // 通常アクセスの場合はログイン画面へリダイレクト
  if (req.path === '/' || req.path === '/index.html') {
    return res.redirect('/login.html');
  }

  next();
};

// 静的ファイルの提供（認証不要なlogin.htmlなどを先に提供）
app.use(express.static('public'));

// 認証ルート
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const validUser = process.env.APP_USER || 'admin';
  const validPass = process.env.APP_PASSWORD || 'password';

  if (username === validUser && password === validPass) {
    // セッションIDを再生成してセッション固定攻撃を防ぐ＆確実に新規セッションにする
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'ログイン処理に失敗しました' });
      }

      req.session.isAuthenticated = true;
      res.json({ success: true, message: 'ログイン成功' });
    });
  } else {
    res.status(401).json({ success: false, error: 'ユーザー名またはパスワードが間違っています' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, error: 'ログアウトに失敗しました' });
    }
    res.json({ success: true, message: 'ログアウトしました' });
  });
});

// 認証確認API
app.get('/api/auth/check', (req, res) => {
  res.json({
    isAuthenticated: !!(req.session && req.session.isAuthenticated),
    user: req.session && req.session.isAuthenticated ? (process.env.APP_USER || 'admin') : null
  });
});

// メインアプリケーションのルート保護
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// APIルートへの認証適用
app.use('/api/note', requireAuth, noteRoutes);
app.use('/api/post', requireAuth, postRoutes);

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
