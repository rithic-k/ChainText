@echo off
echo.
echo ====================================
echo    ChainText Quick Setup
echo ====================================
echo.

echo Installing dependencies...
echo This may take a few minutes...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo Installation failed!
    echo Try: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo ====================================
echo    Installation Complete!
echo ====================================
echo.
echo Quick Start:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:3000
echo   3. Install MetaMask extension
echo   4. Connect wallet and start messaging!
echo.
echo For more info, see README.md
echo.

set /p start="Start development server now? (Y/n): "
if /i "%start%"=="n" goto end

echo.
echo Starting development server...
echo Press Ctrl+C to stop
echo.
npm run dev

:end
echo.
echo To start later: npm run dev
pause
