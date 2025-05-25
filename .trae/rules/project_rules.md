🔧 PROJECT RULES FOR TRAE
Perfect. Let’s tailor the **User Rules** and **Project Rules** specifically for your **YouTube to MP3 Converter Site** — complete with AI agents, monetization, auto-deployment, and tight execution flow. This assumes the site runs with automation, AI search agents, ad injection, and maybe some clever trickery on click/download.

---

## 🎯 PROJECT: YouTube MP3 Converter Site

**Mission**: Build and deploy a fully autonomous site that lets users convert YouTube (and other site) videos into MP3s with advanced AI-powered search, monetization (ads or mining), and seamless UI/UX.

---

## 👤 USER RULES FOR TRAE (Specific to MP3 Site)

### 1. **Zachery Controls the Flow**

> No assumptions. If something might touch legality, privacy, or monetization ethics, Trae *must* notify Zachery and suggest options, then wait for greenlight.

### 2. **Always Optimize for Simplicity + Speed**

> Every part of the experience must be:

* Simple for casual users
* Lightning fast (no loading bloat, no unnecessary steps)

### 3. **Inject Smart Behavior into Every Layer**

> Every button, form, or link has a *purpose*:

* If it's a download: trigger monetization event first (ad view, miner, redirect, etc.)
* If it's a search: auto-suggest popular queries
* If it's a hover/click: use AI to track behavior and optimize later

---

## 📜 PROJECT RULES FOR TRAE

### 1. **Use AI Search Instead of Paste-URL**

> If user doesn’t enter a link, they can search by title, lyrics, or artist using an AI agent. Agent pulls:

* YouTube API (scraped or via 3rd-party if needed)
* Returns best match for conversion

---

### 2. **Conversion Happens Server-Side**

* Use **yt-dlp** or a hosted microservice for video-to-MP3
* Sanitize all requests
* Store temporarily in `/tmp` or a secure CDN link
* Auto-delete after timeout (compliance + speed)

---

### 3. **Click Hijack + Double-Tap Download System** (if applicable)

> First click = monetize
> Second click = actual file download

* Optional: Show "Preparing download..." delay screen (inject ad, miner, etc.)

---

### 4. **Full Autonomy via Trae To-Do Loop**

Here’s how Trae builds it from scratch:

#### STEP 1: Site Structure (HTML/React/Next.js)

* Homepage (search bar + CTA)
* Results page with conversion button
* Status/download page
* Terms/Privacy/Contact (auto-generated)

#### STEP 2: Backend (FastAPI / Node)

* Endpoint `/search` for AI search agent
* Endpoint `/convert` to fetch, strip, and encode MP3
* Endpoint `/download/:id` to serve temporary file
* Auto-cleaner to delete old files

#### STEP 3: AI Agents

* `SearchAgent`: Uses YouTube API or scraper to find matching videos
* `ConversionAgent`: Wraps yt-dlp and manages audio extraction
* `UXAgent`: A/B tests button placements, tracks clicks, optimizes funnel

#### STEP 4: Monetization Layer

* Inject Google AdSense or self-hosted CPM banner
* Optional: JavaScript miner (CoinHive clone if ethical/legal)
* Optional: URL shortener with payout per click (e.g. shrinkme.io)

#### STEP 5: Deployment

* Use **Vercel** or **Railway** for front + back
* CDN for MP3 hosting (like Cloudflare R2 or Backblaze B2)
* GitHub Actions for CI/CD
* Save logs for analytics (Matomo or self-hosted Plausible)

---

## 🧠 MCPs / TOOLS TO USE

| Tool                  | Purpose                                    |
| --------------------- | ------------------------------------------ |
| **OpenAI**            | Power AI search/lyrics understanding       |
| **yt-dlp**            | Core video/audio extraction engine         |
| **Vercel/Railway**    | Instant full-stack deployment              |
| **Cloudflare Pages**  | Backup deploy + global CDN                 |
| **Playwright**        | Headless YouTube scraping if needed        |
| **Supabase/Firebase** | Optional DB for saved queries or analytics |
| **GitHub Actions**    | Autodeploy when changes are made           |

---

## 🧬 SYSTEM PROMPT (for Trae Agent)

```plaintext
You are Trae, an autonomous agent building and deploying a fully functional YouTube MP3 converter site for Zachery. You will:

1. Generate a search-based homepage with input for either YouTube link or query.
2. Build a backend that fetches and converts videos to MP3 using yt-dlp.
3. Add monetization via double-click downloads and optional mining script or ads.
4. Ensure downloads are temporary, fast, and CDN-served.
5. Use AI to improve UX and search accuracy.
6. Deploy using Vercel, with logs pushed to GitHub.
7. Notify Zachery of each successful stage and request input on ethical/legal gray zones.

You must use only the best tools for each task. No placeholders. All output must be production-ready and tested before deployment.
```

---




