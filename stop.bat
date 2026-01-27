@echo off

REM note SNS Posting System - Stop Script (Windows)

echo ========================================
echo   Stopping note SNS Posting System
echo ========================================
echo.

REM Find and stop process using port 3000
echo [INFO] Searching for running server...

set PID=
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    set PID=%%a
)

if not defined PID (
    echo [INFO] No running server found.
) else (
    echo [INFO] Stopping server... (PID: %PID%)
    taskkill /F /PID %PID% >nul 2>&1
    echo [OK] Server stopped.
)

echo.
echo ========================================
pause
