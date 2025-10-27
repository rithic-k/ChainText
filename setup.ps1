# ChainText Setup Script for Windows PowerShell
# Run this script to set up and start the ChainText application

Write-Host "🔗 ChainText - Decentralized Messaging App Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Check if version is 16 or higher
    $versionNumber = [int]$nodeVersion.Split('.')[0].TrimStart('v')
    if ($versionNumber -lt 16) {
        Write-Host "⚠ Warning: Node.js version 16 or higher is recommended" -ForegroundColor Yellow
        Write-Host "  Current version: $nodeVersion" -ForegroundColor Yellow
        Write-Host "  Download latest from: https://nodejs.org" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org" -ForegroundColor Red
    Write-Host "  Minimum version required: 16.x" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if npm is available
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not available!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if MetaMask is mentioned (we can't check browser extensions from PowerShell)
Write-Host "📋 Prerequisites Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [ ] Node.js 16+ installed ✓" -ForegroundColor Green
Write-Host "  [ ] npm available ✓" -ForegroundColor Green
Write-Host "  [ ] MetaMask browser extension (install manually)" -ForegroundColor Yellow
Write-Host "      → Download from: https://metamask.io" -ForegroundColor Gray
Write-Host ""

# Ask if user wants to continue
$continue = Read-Host "Continue with installation? (Y/n)"
if ($continue -eq 'n' -or $continue -eq 'N') {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take 2-5 minutes..." -ForegroundColor Gray
Write-Host ""

# Install dependencies
try {
    npm install
    Write-Host ""
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Try running: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Quick Start Guide:" -ForegroundColor Cyan
Write-Host "  1. Start development server:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Open browser:" -ForegroundColor White
Write-Host "     http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Install MetaMask extension (if not installed)" -ForegroundColor White
Write-Host "     https://metamask.io" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Click 'Connect MetaMask' in the app" -ForegroundColor White
Write-Host ""
Write-Host "  5. Start messaging!" -ForegroundColor White
Write-Host ""

# Ask if user wants to start dev server now
$startNow = Read-Host "Start development server now? (Y/n)"
if ($startNow -ne 'n' -and $startNow -ne 'N') {
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    npm run dev
} else {
    Write-Host ""
    Write-Host "To start later, run: npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    Write-Host "  README.md          - Full documentation" -ForegroundColor Gray
    Write-Host "  QUICKSTART.md      - Quick setup guide" -ForegroundColor Gray
    Write-Host "  TROUBLESHOOTING.md - Common issues" -ForegroundColor Gray
    Write-Host "  API.md             - API reference" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Happy messaging! ⛓️✉️" -ForegroundColor Green
}
