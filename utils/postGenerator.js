/**
 * 投稿文生成ユーティリティ
 */

/**
 * X用投稿文を生成（280文字制限）
 * @param {Object} article - note記事データ
 * @returns {string} - 生成された投稿文
 */
function generateXPost(article) {
    const { title, url } = article;
    const hashtags = '#note #ブログ更新';

    // URL分を考慮（短縮URL想定で23文字）
    const urlLength = 23;
    const hashtagsLength = hashtags.length;
    const separator = '\n\n';

    // タイトル用の最大文字数を計算
    const maxTitleLength = 280 - urlLength - hashtagsLength - separator.length * 2;

    // タイトルを切り詰め
    let truncatedTitle = title;
    if (title.length > maxTitleLength) {
        truncatedTitle = title.substring(0, maxTitleLength - 1) + '…';
    }

    return `${truncatedTitle}${separator}${url}${separator}${hashtags}`;
}

/**
 * Instagram用キャプションを生成
 * @param {Object} article - note記事データ
 * @returns {string} - 生成されたキャプション
 */
function generateInstagramCaption(article) {
    const { title, excerpt, url } = article;
    const hashtags = '#note #ブログ #新着記事';

    let caption = `📝 ${title}\n\n`;

    // 抜粋があれば追加
    if (excerpt) {
        const maxExcerptLength = 100;
        let truncatedExcerpt = excerpt;
        if (excerpt.length > maxExcerptLength) {
            truncatedExcerpt = excerpt.substring(0, maxExcerptLength) + '…';
        }
        caption += `${truncatedExcerpt}\n\n`;
    }

    caption += `🔗 詳しくはプロフィールのリンクから\n${url}\n\n`;
    caption += hashtags;

    return caption;
}

/**
 * 両方のSNS用投稿文を一括生成
 * @param {Object} article - note記事データ
 * @returns {Object} - X用とInstagram用の投稿文
 */
function generatePosts(article) {
    return {
        x: generateXPost(article),
        instagram: generateInstagramCaption(article)
    };
}

module.exports = {
    generateXPost,
    generateInstagramCaption,
    generatePosts
};
