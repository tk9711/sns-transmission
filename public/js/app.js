/**
 * note SNS投稿支援システム - フロントエンド
 */

// グローバル状態
let currentArticle = null;
let articles = [];

// DOM要素
const elements = {
    loadArticlesBtn: document.getElementById('loadArticlesBtn'),
    articlesGrid: document.getElementById('articlesGrid'),
    emptyState: document.getElementById('emptyState'),
    loading: document.getElementById('loading'),
    messageArea: document.getElementById('messageArea'),
    statusBar: document.getElementById('statusBar'),
    statusX: document.getElementById('statusX'),
    statusInstagram: document.getElementById('statusInstagram'),

    // モーダル
    postModal: document.getElementById('postModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    modalArticleTitle: document.getElementById('modalArticleTitle'),
    modalArticleUrl: document.getElementById('modalArticleUrl'),
    xPostText: document.getElementById('xPostText'),
    instagramPostText: document.getElementById('instagramPostText'),
    instagramImageUrl: document.getElementById('instagramImageUrl'),
    xCharCount: document.getElementById('xCharCount'),
    postToXBtn: document.getElementById('postToXBtn'),
    postToInstagramBtn: document.getElementById('postToInstagramBtn')
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkAPIStatus();
});

/**
 * イベントリスナー初期化
 */
function initEventListeners() {
    elements.loadArticlesBtn.addEventListener('click', loadArticles);
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    elements.postToXBtn.addEventListener('click', postToX);
    elements.postToInstagramBtn.addEventListener('click', postToInstagram);

    // X投稿文の文字数カウント
    elements.xPostText.addEventListener('input', updateXCharCount);

    // モーダル外クリックで閉じる
    elements.postModal.addEventListener('click', (e) => {
        if (e.target === elements.postModal) {
            closeModal();
        }
    });

    // ログアウトボタン
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        if (!confirm('ログアウトしますか？')) return;

        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('ログアウトエラー:', error);
            alert('ログアウトに失敗しました');
        }
    });
}

/**
 * API接続状態を確認
 */
async function checkAPIStatus() {
    try {
        const response = await fetch('/api/post/status');

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        const result = await response.json();

        if (result.success) {
            updateStatusBadge(elements.statusX, result.data.x);
            updateStatusBadge(elements.statusInstagram, result.data.instagram);
        }
    } catch (error) {
        console.error('ステータス確認エラー:', error);
    }
}

/**
 * ステータスバッジを更新
 */
function updateStatusBadge(element, isConnected) {
    if (isConnected) {
        element.classList.add('connected');
        element.classList.remove('disconnected');
    } else {
        element.classList.add('disconnected');
        element.classList.remove('connected');
    }
}

/**
 * note記事を読み込み
 */
async function loadArticles() {
    showLoading(true);
    hideMessage();

    try {
        const response = await fetch('/api/note/articles');

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || '記事の取得に失敗しました');
        }

        articles = result.data;
        renderArticles(articles);

        if (articles.length === 0) {
            showMessage('記事が見つかりませんでした。.envファイルのNOTE_RSS_URLを確認してください。', 'error');
        }
    } catch (error) {
        console.error('記事取得エラー:', error);
        showMessage(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * 記事一覧を表示
 */
function renderArticles(articles) {
    elements.articlesGrid.innerHTML = '';

    if (articles.length === 0) {
        elements.emptyState.style.display = 'block';
        return;
    }

    elements.emptyState.style.display = 'none';

    articles.forEach(article => {
        const card = createArticleCard(article);
        elements.articlesGrid.appendChild(card);
    });
}

/**
 * 記事カードを作成
 */
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => openPostModal(article);

    const thumbnail = article.thumbnail || 'https://via.placeholder.com/400x200/667eea/ffffff?text=No+Image';
    const date = new Date(article.publishedAt).toLocaleDateString('ja-JP');

    card.innerHTML = `
    <img src="${thumbnail}" alt="${escapeHtml(article.title)}" class="article-thumbnail" onerror="this.src='https://via.placeholder.com/400x200/667eea/ffffff?text=No+Image'">
    <div class="article-content">
      <h3 class="article-title">${escapeHtml(article.title)}</h3>
      <p class="article-excerpt">${escapeHtml(article.excerpt)}</p>
      <p class="article-date">📅 ${date}</p>
    </div>
  `;

    return card;
}

/**
 * 投稿モーダルを開く
 */
async function openPostModal(article) {
    currentArticle = article;

    // 記事情報を表示
    elements.modalArticleTitle.textContent = article.title;
    elements.modalArticleUrl.href = article.url;
    elements.instagramImageUrl.textContent = article.thumbnail || 'サムネイル画像なし';

    // 投稿文を自動生成
    try {
        const response = await fetch('/api/post/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ article })
        });

        const result = await response.json();

        if (result.success) {
            elements.xPostText.value = result.data.x;
            elements.instagramPostText.value = result.data.instagram;
            updateXCharCount();
        }
    } catch (error) {
        console.error('投稿文生成エラー:', error);
        showMessage('投稿文の生成に失敗しました', 'error');
    }

    // モーダルを表示
    elements.postModal.classList.add('active');
}

/**
 * モーダルを閉じる
 */
function closeModal() {
    elements.postModal.classList.remove('active');
    currentArticle = null;
}

/**
 * X文字数カウントを更新
 */
function updateXCharCount() {
    const text = elements.xPostText.value;
    const count = text.length;
    elements.xCharCount.textContent = `${count} / 280`;

    if (count > 280) {
        elements.xCharCount.classList.add('error');
        elements.xCharCount.classList.remove('warning');
    } else if (count > 250) {
        elements.xCharCount.classList.add('warning');
        elements.xCharCount.classList.remove('error');
    } else {
        elements.xCharCount.classList.remove('warning', 'error');
    }
}

/**
 * Xに投稿
 */
async function postToX() {
    const text = elements.xPostText.value.trim();

    if (!text) {
        showMessage('投稿文を入力してください', 'error');
        return;
    }

    if (text.length > 280) {
        showMessage('投稿文は280文字以内にしてください', 'error');
        return;
    }

    elements.postToXBtn.disabled = true;
    elements.postToXBtn.textContent = '投稿中...';

    try {
        const response = await fetch('/api/post/x', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const result = await response.json();

        if (result.success) {
            showMessage('✅ Xへの投稿に成功しました！', 'success');
            closeModal();
        } else {
            throw new Error(result.error || '投稿に失敗しました');
        }
    } catch (error) {
        console.error('X投稿エラー:', error);
        showMessage(error.message, 'error');
    } finally {
        elements.postToXBtn.disabled = false;
        elements.postToXBtn.innerHTML = '<span>𝕏</span><span>Xに投稿</span>';
    }
}

/**
 * Instagramに投稿
 */
async function postToInstagram() {
    const caption = elements.instagramPostText.value.trim();
    const imageUrl = currentArticle?.thumbnail;

    if (!caption) {
        showMessage('キャプションを入力してください', 'error');
        return;
    }

    if (!imageUrl) {
        showMessage('サムネイル画像がありません', 'error');
        return;
    }

    elements.postToInstagramBtn.disabled = true;
    elements.postToInstagramBtn.textContent = '投稿中...';

    try {
        const response = await fetch('/api/post/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl, caption })
        });

        const result = await response.json();

        if (result.success) {
            showMessage('✅ Instagramへの投稿に成功しました！', 'success');
            closeModal();
        } else {
            throw new Error(result.error || '投稿に失敗しました');
        }
    } catch (error) {
        console.error('Instagram投稿エラー:', error);
        showMessage(error.message, 'error');
    } finally {
        elements.postToInstagramBtn.disabled = false;
        elements.postToInstagramBtn.innerHTML = '<span>📷</span><span>Instagramに投稿</span>';
    }
}

/**
 * ローディング表示切り替え
 */
function showLoading(show) {
    elements.loading.style.display = show ? 'block' : 'none';
}

/**
 * メッセージを表示
 */
function showMessage(message, type = 'error') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    elements.messageArea.innerHTML = '';
    elements.messageArea.appendChild(messageDiv);

    // 5秒後に自動削除
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * メッセージを非表示
 */
function hideMessage() {
    elements.messageArea.innerHTML = '';
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
