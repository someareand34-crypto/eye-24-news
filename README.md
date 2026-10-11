# Eye 24 (eye24.vercel.app)
> **A Fully Automated Global News Portal That Makes Money**

Eye 24 is a high-speed, automated Bengali news portal designed for hands-off syndication, multi-channel viral distribution, and continuous monetization through Google AdSense, Daraz Bangladesh, and Rokomari.com affiliate programs.

---

## ⚡ How the Automated System Works

```
                        [ World News Sources ]
             (NewsAPI / GNews / BBC / CNN / Reuters RSS)
                                  │
                       (Every 15 Minutes Cron)
                                  ▼
               [ Auto-Translation to Bangla ]
          (Google Translate API or MyMemory Free Engine)
                                  │
                                  ▼
                     [ Admin Moderation Queue ]
                  (Preview, Instant Edit & Approve)
                                  │
                        (Admin Clicks Approve)
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
  [ Eye 24 Portal ]      [ Facebook Page ]       [ WhatsApp Channel ]
(Live Article & Ads)    (Graph API Autopost)    (Cloud API Broadcast)
         │
         ▼
[ Automated Monetization ]
• Google AdSense High-CTR Placements (Header, In-Feed, Sidebar)
• Daraz 40%+ Off Tech & Electronics Deals (?aff=DARAZ_ID)
• Rokomari Best-Seller Books (?ref=ROKOMARI_ID)
```

---

## 🔑 How to Get Required API Keys

### 1. News API Keys (Fetch Viral News)
- **NewsAPI**: Register at [newsapi.org/register](https://newsapi.org/register) to get a free API key (gives access to top breaking global headlines).
- **GNews**: Register at [gnews.io](https://gnews.io/) to get an API key with 100 free requests per day.
- **RSS Feeds**: Built-in free feeds from BBC World, CNN Edition, and Al Jazeera are pre-configured and require no API key.

### 2. Bengali Translation
- **Google Cloud Translation API**: Go to [Google Cloud Console](https://console.cloud.google.com/) > Enable "Cloud Translation API" > Create API Key.
- *Free Alternative*: If `GOOGLE_TRANSLATE_API_KEY` is left blank, Eye 24 automatically falls back to the free **MyMemory Translation API** (`api.mymemory.translated.net`).

### 3. Facebook Auto-Posting (FB Page Graph API)
- Go to [developers.facebook.com](https://developers.facebook.com/) > Create an App > Add "Pages API".
- Generate a **Page Access Token** with `pages_manage_posts` and `pages_read_engagement` permissions.
- Get your **Page ID** from your Facebook Page's "About" section.

### 4. WhatsApp Cloud API (Channel & Subscriber Broadcast)
- Go to [developers.facebook.com](https://developers.facebook.com/) > Select your App > Set up **WhatsApp**.
- Copy your **Permanent Access Token** and **Phone Number ID**.
- Enter your target WhatsApp Channel ID (e.g. `120363028472910@newsletter`).

### 5. Monetization & Affiliates
- **Google AdSense**: Go to [adsense.google.com](https://adsense.google.com/) > Copy your Publisher ID (`ca-pub-xxxxxxxxxxxxxxxx`) and create Responsive Display Ad Units for Slot 1, 2, and 3.
- **Daraz Affiliate**: Register at the [Daraz Affiliate Program](https://www.daraz.com.bd/) and copy your Affiliate ID.
- **Rokomari Affiliate**: Register at [rokomari.com/affiliate](https://www.rokomari.com/affiliate) and copy your Referral ID.

---

## 🛠️ How to Set Keys in Admin Panel

1. Go to **`/admin/login`** on your deployed website or local environment.
2. Enter the Admin Password (default: `Eye24Admin@123`).
3. Click on **সিস্টেম সেটিংস & API** (`/admin/settings`).
4. Fill in the fields:
   - **Section A**: NewsAPI Key, GNews Key, RSS Feeds.
   - **Section B**: Google Translate Key and toggle `AUTO_TRANSLATE`.
   - **Section C**: Facebook Page Token, Page ID, WhatsApp Cloud Token, and Channel IDs.
   - **Section D**: AdSense Client ID, Ad slots, Daraz Affiliate ID, and Rokomari Affiliate ID.
   - **Section E**: Set `FETCH_INTERVAL` (15min), `AUTO_APPROVE` (On/Off), and `VIRAL_FILTER`.
5. Click **"সেটিংস সেভ করুন"**. All keys are securely stored in MongoDB and immediately power the automated crons.

---

## ⏱️ How the Crons Work on Vercel

Configured in `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/fetch-news", "schedule": "*/15 * * * *" },
    { "path": "/api/cron/fetch-affiliate", "schedule": "0 8,20 * * *" }
  ]
}
```

1. **`fetch-news` (Runs every 15 minutes)**:
   - Fetches breaking news from NewsAPI, GNews, and RSS feeds.
   - Translates headlines and story summaries into Bengali.
   - Deduplicates articles by URL.
   - Inserts into MongoDB with status `pending` (or `published` if `AUTO_APPROVE` is active).

2. **`fetch-affiliate` (Runs twice daily at 8:00 AM & 8:00 PM)**:
   - Queries best-selling deals with $\ge 40\%$ discount and high user ratings.
   - Scrapes/generates high-converting Bengali deal cards for electronics, gadgets, and books.
   - Injects your `DARAZ_AFFILIATE_ID` and `ROKOMARI_AFFILIATE_ID` tracking tokens into all buy links.

---

## 📁 Tech Stack
- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS
- **Backend**: Vercel Serverless Functions (`/api/*`)
- **Database**: MongoDB Atlas + Mongoose
- **Deployment**: Vercel
