@echo off
chcp 65001 >nul

REM note SNS投稿支援システム 停止スクリプト (Windows版)

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ⏹  note SNS投稿支援システムを停止します
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM ポート3000を使用しているプロセスを検索して停止
echo 🔍 実行中のサーバーを検索しています...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    set PID=%%a
)

if not defined PID (
    echo ℹ️  実行中のサーバーが見つかりませんでした
) else (
    echo 🛑 サーバーを停止しています... (PID: %PID%)
    taskkill /F /PID %PID% >nul 2>&1
    echo ✅ サーバーを停止しました
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pause
