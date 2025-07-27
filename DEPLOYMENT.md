# 🚀 Deployment Guide

This guide covers deploying GoQuant Latency Visualizer to various platforms.

## 📋 Pre-deployment Checklist

- [ ] All tests pass: `npm run build`
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] Dependencies up to date
- [ ] README.md updated
- [ ] Version bumped in package.json

## 🔷 Vercel Deployment (Recommended)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd goquant-latency-visualizer
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - What's your project's name? **goquant-latency-visualizer**
   - In which directory is your code located? **./**

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import from GitHub:**
   - Connect your GitHub account
   - Select the `goquant-latency-visualizer` repository
4. **Configure Project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next
   - **Install Command:** `npm install`
5. **Environment Variables:** (if needed)
   ```
   NEXT_PUBLIC_API_URL=your-api-endpoint
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```
6. **Click "Deploy"**

### Vercel Configuration

Create `vercel.json` in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Commands
```bash
# Build image
docker build -t goquant-latency-visualizer .

# Run container
docker run -p 3000:3000 goquant-latency-visualizer

# Run with environment variables
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=your-api goquant-latency-visualizer
```

## ☁️ Netlify Deployment

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

## 🌐 GitHub Pages (Static Export)

1. **Update next.config.ts:**
   ```typescript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }

   module.exports = nextConfig
   ```

2. **Build and export:**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages:**
   - Push `out` folder to `gh-pages` branch
   - Enable GitHub Pages in repository settings

## 🔧 Environment Variables

### Production Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.goquant.com
NEXT_PUBLIC_WS_URL=wss://ws.goquant.com

# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_DATA=true
NEXT_PUBLIC_DEBUG_MODE=false

# Performance
NEXT_PUBLIC_MAX_CONNECTIONS=50
NEXT_PUBLIC_UPDATE_INTERVAL=5000
```

### Development Environment Variables
```bash
# Development API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8001

# Debug Settings
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Check for unused dependencies
npx depcheck

# Optimize images
npm install next-optimized-images
```

### Runtime Optimization
- Enable gzip compression
- Configure CDN for static assets
- Set up proper caching headers
- Monitor Core Web Vitals

## 🔍 Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Google Analytics
```typescript
// Add to _app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Memory Issues**
   ```bash
   # Increase Node.js memory
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

3. **TypeScript Errors**
   ```bash
   # Check types
   npx tsc --noEmit
   ```

### Performance Issues
- Check bundle size with `npm run analyze`
- Optimize images and assets
- Enable compression
- Use CDN for static files

## 📈 Post-Deployment

### Monitoring
- Set up uptime monitoring
- Configure error tracking (Sentry)
- Monitor performance metrics
- Set up alerts for downtime

### Updates
```bash
# Deploy updates
git push origin main  # Auto-deploys on Vercel
vercel --prod         # Manual deployment
```

### Rollback
```bash
# Rollback to previous deployment
vercel rollback [deployment-url]
```

## 🔐 Security

### Headers Configuration
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## 📞 Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Open an issue on GitHub
- Contact: Kumarakshat366@gmail.com