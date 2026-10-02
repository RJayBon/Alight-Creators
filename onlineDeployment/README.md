# 🎬 Alight Creators

> A community-powered learning hub for mastering **Alight Motion** — built with vanilla PHP, MySQL, and zero frameworks.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![PHP](https://img.shields.io/badge/PHP-7.4%2B-777BB4?logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 About

**Alight Creators** is a beginner-friendly tutorial platform where motion designers share step-by-step Alight Motion guides, rate each other's work, and discover new techniques — all wrapped in a sleek dark UI with neon cyan and purple accents.

Whether you're picking up the app for the first time or hunting for advanced keyframe tricks, Alight Creators gives you a clean, distraction-free space to learn from real creators.

---

## ✨ Features

### 📚 For Learners
- **Curated tutorial library** — filter by Beginner, Intermediate, Advanced, or Tips & Tricks
- **Step-by-step breakdowns** — clear, ordered instructions with guiding videos
- **Downloadable resources** — presets, project files, and assets attached to each tutorial
- **Personalized feed** — "Recommended" (top-rated) and "Latest" sections on the home dashboard
- **Search & discovery** — popular tutorial sidebar, category chips, and mobile-first navigation
- **Creator profiles** — Discord-style public pages with bio, banner, avatar, and published tutorials

### ✍️ For Creators
- **Rich tutorial editor** — upload thumbnails, videos, break into up to 15 steps, attach up to 10 resources
- **Live preview panel** — see your tutorial card update in real time as you type
- **Client-side image cropping** — 1:1 avatars and 4:1 banners using Cropper.js
- **Full edit & delete control** — replace media, reorder steps, remove assets, all in one place

### 🤝 For Community
- **Dual-axis ratings** — rate tutorials on Quality and Easy-to-Read (1–5 stars each)
- **"Love" system** — show appreciation for creators with a single click
- **Copy-link sharing** — one button copies a direct URL to the tutorial, ready to paste anywhere
- **Contact form** — send messages directly to the platform owners

### 🛡️ Security & Reliability
- Bcrypt password hashing (`password_hash` with cost 12 for seeded admin)
- CSRF protection on every state-changing request
- Session-based rate limiting (login, register, contact, rating, sharing)
- Prepared statements — zero SQL injection surface
- HTML escaping via `safe()` helper — zero XSS surface
- MIME-verified file uploads (extension + `finfo` sniffing)
- SHA-256 hashed password reset tokens with 15-minute TTL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | PHP 7.4+ (procedural, no framework) |
| **Database** | MySQL 5.7+ / MariaDB 10.2+ (PDO prepared statements) |
| **Frontend** | HTML5 · CSS3 (custom properties) · Vanilla ES6 JavaScript |
| **Auth** | PHP sessions · bcrypt · CSRF tokens |
| **Media** | Local file storage (`/uploads/`) |
| **Fonts** | Local `Varela Round` |
| **Icons** | Inline SVG only |
| **Third-party** | [Cropper.js 1.6.2](https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/) (CDN, profile page only) |

**Design philosophy:** No build step. No bundler. No npm. Just clean, readable code that runs anywhere PHP does.

---

## 🚀 Quick Start

### Prerequisites
- PHP **7.4+** (tested on 8.0 and 8.1)
- MySQL **5.7+** or MariaDB **10.2+**
- A local server (Apache, Nginx, or PHP's built-in server)
- Write permissions on `uploads/` subdirectories

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/alight-creators.git
cd alight-creators
