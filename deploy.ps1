# Snow Ball Deployment Script
# This script helps deploy Snow Ball to GitHub and Vercel

Write-Host "=== Snow Ball Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking for Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Or use: winget install Git.Git" -ForegroundColor White
    Write-Host ""
    $install = Read-Host "Would you like to try installing Git with winget? (y/n)"
    if ($install -eq "y" -or $install -eq "Y") {
        Write-Host "Installing Git..." -ForegroundColor Yellow
        winget install Git.Git
        Write-Host "Please restart PowerShell after Git installation and run this script again." -ForegroundColor Yellow
        exit
    } else {
        Write-Host "Please install Git manually and run this script again." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""

# Check if repository is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
}

Write-Host ""

# Check if files are staged
Write-Host "Staging files..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files staged" -ForegroundColor Green

Write-Host ""

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Initial commit: Snow Ball task manager"
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
}

Write-Host ""

# Check if remote is set
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "GitHub repository setup required:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Create a new repository named 'snow-ball'" -ForegroundColor White
    Write-Host "3. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
    Write-Host "4. Copy the repository URL" -ForegroundColor White
    Write-Host ""
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/snow-ball.git)"
    
    if ($repoUrl) {
        Write-Host "Adding remote..." -ForegroundColor Yellow
        git remote add origin $repoUrl
        git branch -M main
        Write-Host "✓ Remote added" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to push. Make sure you're authenticated with GitHub." -ForegroundColor Red
            Write-Host "You may need to set up GitHub authentication:" -ForegroundColor Yellow
            Write-Host "  - Use GitHub CLI: gh auth login" -ForegroundColor White
            Write-Host "  - Or use Personal Access Token" -ForegroundColor White
        }
    }
} else {
    Write-Host "✓ Remote already configured: $remote" -ForegroundColor Green
    Write-Host ""
    $push = Read-Host "Push to GitHub? (y/n)"
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy to Vercel:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Click 'Add New Project'" -ForegroundColor White
Write-Host "3. Import your GitHub repository" -ForegroundColor White
Write-Host "4. Vercel will auto-detect Vite settings" -ForegroundColor White
Write-Host "5. Click 'Deploy'!" -ForegroundColor White
Write-Host ""
Write-Host "Or use Vercel CLI:" -ForegroundColor Yellow
Write-Host "  npm install -g vercel" -ForegroundColor White
Write-Host "  vercel" -ForegroundColor White
Write-Host ""

