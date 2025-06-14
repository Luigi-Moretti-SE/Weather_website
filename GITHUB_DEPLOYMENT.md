# GitHub Pages Deployment Guide

## Initial Setup

### 1. Configure API Key
Before deploying, make sure your API key is properly configured:

1. Copy `js/config.template.js` to `js/config.js`
2. Replace `YOUR_API_KEY_HERE` with your actual OpenWeatherMap API key
3. The `config.js` file is already in `.gitignore` and won't be committed

### 2. Initialize Git Repository
```bash
cd weather_website
git init
git add .
git commit -m "Initial commit - weather website ready for deployment"
```

### 3. Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `weather-website` or `weathercast-web`
3. Don't initialize with README (we already have one)

### 4. Connect Local to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 5. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 6. Configure for GitHub Pages
Since GitHub Pages doesn't support server-side environment variables, you'll need to:

**Option A: Public API Key (Less Secure)**
- Remove `config.js` from `.gitignore`
- Commit the file with your API key
- ⚠️ **Warning**: Your API key will be publicly visible

**Option B: Client-Side Environment Setup (Recommended)**
- Use GitHub Secrets for sensitive deployment configurations
- Set up a build process that injects the API key during deployment

## Your Website URL
After enabling GitHub Pages, your website will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## For Production Deployment

### Recommended Security Setup
1. Regenerate your OpenWeatherMap API key specifically for web use
2. Set up domain restrictions in OpenWeatherMap dashboard
3. Consider implementing a backend proxy to hide the API key completely

### Domain Setup (Optional)
1. Purchase a custom domain
2. Add a `CNAME` file with your domain name
3. Configure DNS settings with your domain provider
4. Update GitHub Pages settings to use custom domain

## Troubleshooting

### Common Issues
1. **HTTPS Mixed Content**: Make sure all API calls use HTTPS
2. **API Key Exposure**: Consider the security implications of client-side API keys
3. **CORS Issues**: OpenWeatherMap API should work fine with browser requests

### GitHub Pages Limitations
- Only static sites (HTML, CSS, JS)
- No server-side processing
- 1GB repository size limit
- 100GB bandwidth limit per month
