# Deployment Guide for Snow Ball

This guide will help you deploy Snow Ball to GitHub and Vercel.

## Prerequisites

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Or use winget: `winget install Git.Git`

2. **GitHub Account**: Make sure you have a GitHub account

3. **Vercel Account**: Sign up at https://vercel.com (you can use GitHub to sign in)

## Step 1: Install Git (if needed)

If Git is not installed, download and install it from https://git-scm.com/download/win

After installation, restart your terminal/PowerShell.

## Step 2: Initialize Git Repository

Open PowerShell in this directory and run:

```powershell
git init
git add .
git commit -m "Initial commit: Snow Ball task manager"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `snow-ball` (or `Snow-Ball`)
3. Description: "Liquid Glass Task Manager - A beautiful task management app"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 4: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in PowerShell:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/snow-ball.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 5: Deploy to Vercel

### Option A: Via Vercel Website (Recommended)

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository `snow-ball`
4. Vercel will auto-detect the settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"
6. Your app will be live in a few minutes!

### Option B: Via Vercel CLI

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Login to Vercel:
   ```powershell
   vercel login
   ```

3. Deploy:
   ```powershell
   vercel
   ```

4. Follow the prompts and your app will be deployed!

## Environment Variables (Optional)

If you're using Gemini AI features, add your API key in Vercel:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add `VITE_API_KEY` or `API_KEY` with your Gemini API key
4. Redeploy

## That's it!

Your Snow Ball app should now be live on Vercel! 🎉

