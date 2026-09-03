# PenQraft — Studio Frontend SPA

<div align="center">
  <img src="public/hand-pen.png" width="160" alt="PenQraft Logo" />
  <h3>Autonomous Multi-Agent Long-Form Narrative Craft Workspace</h3>
  <p>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.4+-42b883?style=flat&logo=vue.js" alt="Vue 3" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.4+-646CFF?style=flat&logo=vite" alt="Vite" /></a>
    <a href="https://pages.cloudflare.com/"><img src="https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat&logo=cloudflare" alt="Cloudflare Pages" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  </p>
</div>

---

## 🌟 Overview

This repository contains the standalone **Vue 3 SPA** frontend for **PenQraft Studio**, designed for seamless edge deployment on **Cloudflare Pages**, Vercel, or Netlify.

### Features
- **Vue 3 + Vite 5 + Vue Router 4**: High-performance Single Page Application.
- **Dynamic Hero Handwriting Animation**: Natural handwriting cursor animation powered by custom craft assets.
- **8-Agent Narrative Workspace**: Interactive Story Bible, Evaluator-Optimizer loop, continuity auditor, and direct manuscript export tools.
- **Traditional & AI SEO**: Complete JSON-LD schema graphs (`SoftwareApplication`, `FAQPage`, `Organization`, `WebSite`), Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml`, and `llms.txt`.
- **Bearer Token REST Client**: Direct API communication with the Spinx backend.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Set your backend API endpoint:
```env
VITE_API_URL=http://localhost:8080
```

### 3. Start Development Server
```bash
npm run dev
# Live at http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
# Production assets compiled to dist/
```

---

## ☁️ Cloudflare Pages Deployment

1. Connect this repository to **Cloudflare Pages**.
2. Build Settings (Default):
   - **Framework preset**: `Vite` (or `Vue`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: `https://api.yourdomain.com` (Your live backend API URL)
4. Click **Save and Deploy**.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
