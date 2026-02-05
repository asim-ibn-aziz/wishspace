# Deploy WishSpace to Vercel (free, no domain, no credit card)

You **don’t need a domain**. Vercel gives you a free URL like `wishspace.vercel.app` when you deploy.

---

## Step 1: Push your code to GitHub

1. Create a new repo on [GitHub](https://github.com/new) (e.g. `wishspace`).
2. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/wishspace.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `wishspace` with your GitHub username and repo name.

---

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with **GitHub**.
2. Click **Add New** → **Project**.
3. Import your repo (e.g. `wishspace`). Click **Import**.
4. **Configure Project:**
   - **Framework Preset:** Vite (or leave as detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install` (default)
5. **Environment Variables** – click **Add** and add these (copy values from your `.env`):

   | Name | Value (from your .env) |
   |------|------------------------|
   | `VITE_FIREBASE_API_KEY` | your API key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | your auth domain |
   | `VITE_FIREBASE_PROJECT_ID` | your project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | your storage bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | your sender ID |
   | `VITE_FIREBASE_APP_ID` | your app ID |

6. Click **Deploy**. Wait for the build to finish.
7. Your app will be live at a URL like **`https://wishspace-xxxx.vercel.app`** (Vercel shows it on the project page). You don’t need a custom domain.

---

## Step 3: Allow the Vercel URL in Firebase

Login/register won’t work until Firebase allows your Vercel URL:

1. Open [Firebase Console](https://console.firebase.google.com) → your project.
2. Go to **Authentication** → **Settings** → **Authorized domains**.
3. Click **Add domain**.
4. Enter your Vercel domain **without** `https://`, e.g.:
   - `wishspace-xxxx.vercel.app`  
   (Use the exact URL Vercel gave you.)
5. Click **Add**.

After this, sign in and sign up will work on your deployed app.

---

## Done

- **App URL:** `https://your-project.vercel.app` (from Vercel’s project page).
- **No domain needed** – that URL is enough.
- **No credit card** – Vercel’s free tier is enough for this app.
- Future pushes to `main` will trigger a new deploy automatically.

---

## Other options (optional)

- **Netlify:** Same idea: connect repo, build command `npm run build`, publish directory `dist`, add the same env vars. You get a free URL like `something.netlify.app`. Add that URL to Firebase **Authorized domains**.
- **GitHub Pages:** Free and no card, but needs a bit more setup (Actions + base path). See the previous version of this file if you need it.
