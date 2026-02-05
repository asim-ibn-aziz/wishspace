# WishSpace

A frontend-only social space where each post is a **wish** shown as a ⭐ star. Built with TypeScript, Tailwind CSS, and Firebase (Auth + Firestore).

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com).
   - Enable **Authentication** → Email/Password.
   - Create a **Firestore** database.
   - In Project settings, copy your config and paste it into `src/ts/firebase.ts` (replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc.).
   - Deploy security rules: `firebase deploy --only firestore:rules` (or paste `firestore.rules` in the Firestore Rules editor).

3. **Run**
   - Dev: `npm run dev`, then open `http://localhost:5173/` or `http://localhost:5173/login.html`.
   - Build: `npm run build`. Output is in `dist/`.

4. **Deploy (free, no credit card)**  
   See [DEPLOY.md](./DEPLOY.md) for Vercel, Netlify, and GitHub Pages.

## Structure

- `src/pages/` – login, register, space (HTML).
- `src/ts/` – firebase, auth, wishes, space, ui, types.
- `src/entry-*.ts` – page entry scripts.
- `firestore.rules` – Firestore security rules.

## Screens

1. **Login** – Email, password, link to Register.
2. **Register** – Username, email, password, link to Login.
3. **Space** – Full-screen space with stars (wishes). “+ Create Wish” opens modal; clicking a star opens wish modal with like.

All pages require login; unauthenticated users are redirected to the login page.

## Seed script (100 users + 100 wishes)

To populate Firestore with 100 test accounts and 100 wishes:

1. **Service account key**
   - Firebase Console → Project settings → **Service accounts**
   - Click **Generate new private key** and save the JSON file
   - Put it in the project root as `serviceAccountKey.json` (or set `GOOGLE_APPLICATION_CREDENTIALS` to its path)

2. **Install and run**
   ```bash
   npm install
   npm run seed
   ```

This creates 100 users (`wishspace.seed.1@example.com` … `wishspace.seed.100@example.com`) with password `SeedPass123!`, and one wish per user with random text and position. Do not use this password in production.
