# The Linen Solutions

An elegant, fully-featured marketing & catalogue website for a premium linen brand,
with a built-in admin studio for managing content. Built with React + Vite +
Tailwind + framer-motion, designed to deploy to **GitHub Pages** with **Firebase**
(free tier) for live data.

---

## ✨ What's inside

- **Public website** — Home, Shop (with category filter & sort), Product detail
  (gallery, variants, WhatsApp enquiry), About, Contact (with map & form).
- **Admin studio** at `/admin` — login-protected CRUD for products, categories,
  and all site content (hero, story, testimonials, contact details, etc.).
- **Smart data layer** — runs on built-in sample data + browser storage out of the
  box (zero setup), and automatically switches to **live Firebase** the moment you
  add your project keys.
- **Rich sample content** — 14 products across 4 categories, ready to demo.

---

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

- **Website:** `/`
- **Admin:** `/admin` — default demo password: **`linen-admin`**
  (Edits in demo mode save to your browser only.)

---

## 🔌 Connect Firebase (free live data)

The site works fully without Firebase. To make admin edits persistent and shared
across all visitors:

1. Create a free project at <https://console.firebase.google.com>.
2. **Build → Firestore Database → Create database** (start in *production* mode).
3. **Build → Storage → Get started** (for image uploads).
4. **Build → Authentication → Sign-in method → enable Email/Password**, then add an
   admin user (Authentication → Users → Add user).
5. **Project settings → Your apps → Web app** → copy the config values.
6. Create a `.env` file (copy from `.env.example`) and fill in:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_ADMIN_EMAIL=you@example.com   # optional: lock admin to one email
   ```

7. Restart `npm run dev`. The site now reads & writes live Firestore, and seeds
   itself with the sample content on first run. Log in to `/admin` with the Firebase
   user you created.

### Suggested Firestore security rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /{document=**} {
      allow read: if true;                 // public can read the catalogue
      allow write: if request.auth != null; // only signed-in admins can edit
    }
  }
}
```

### Suggested Storage rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🌐 Deploy to GitHub Pages

A custom domain (`thelinensolutions.com`) is assumed — `public/CNAME` is already set.

```bash
npm run deploy   # builds and pushes ./dist to the gh-pages branch
```

Then in **GitHub → Settings → Pages**, set the source to the `gh-pages` branch and
add your custom domain. The included `404.html` handles client-side routing so deep
links (e.g. `/shop`, `/admin`) work on refresh.

> Hosting at `username.github.io/thelinensolutions/` instead of a custom domain?
> Build with `VITE_BASE=/thelinensolutions/ npm run build`, set
> `pathSegmentsToKeep = 1` in `public/404.html`, and remove `public/CNAME`.

> **Note:** Firebase keys are public by design (they identify, not authorise). Your
> data is protected by the Firestore/Storage security rules above, not by hiding keys.

---

## 🎨 Customising

- **Sample content:** `src/lib/data/seed.ts` (or just edit everything via `/admin`).
- **Brand colours & fonts:** `tailwind.config.js` + `src/index.css`.
- **Pages:** `src/pages/`, shared UI in `src/components/`.
