document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // ログイン状態チェック（既にログイン済みの場合はメイン画面へ）
    fetch('/api/auth/check')
        .then(res => res.json())
        .then(data => {
            if (data.isAuthenticated) {
                window.location.href = '/';
            }
        })
        .catch(console.error);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // ボタンをローディング状態に
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '認証中...';
        errorMessage.style.display = 'none';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                // ログイン成功したらメイン画面へ遷移
                window.location.href = '/';
            } else {
                // エラー表示
                errorMessage.textContent = data.error || 'ログインに失敗しました';
                errorMessage.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'サーバーエラーが発生しました';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});
