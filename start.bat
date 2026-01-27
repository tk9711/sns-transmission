@echo off

REM note SNS Posting System - Start Script (Windows)

REM Move to script directory
cd /d "%~dp0"

echo ========================================
echo   note SNS Posting System
echo ========================================
echo.
echo Starting server...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed.
    echo         Please install from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] First run: Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found.
    echo           Creating from .env.example...
    copy .env.example .env >nul
    echo           .env file created.
    echo.
    echo [NEXT STEPS]
    echo   1. Open .env file and set your API credentials
    echo   2. Run this script again
    echo.
    pause
    notepad .env
    exit /b 0
)

echo [OK] Ready to start
echo.
echo ========================================
echo   Open in browser: http://localhost:3000
echo.
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

REM Open browser after 2 seconds
timeout /t 2 /nobreak >nul
start http://localhost:3000

REM Start server
call npm start
