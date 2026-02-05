/**
 * Seed script: creates 100 Firebase Auth users and 100 wishes in Firestore.
 *
 * Prerequisites:
 * 1. Firebase project with Auth (Email/Password) and Firestore enabled.
 * 2. Service account key: Firebase Console → Project settings → Service accounts
 *    → Generate new private key. Save as e.g. serviceAccountKey.json in project root.
 * 3. Set in .env: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
 *    (or the full path to your key file)
 *
 * Run: node scripts/seed-wishes.js
 */

import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// Load service account from path in env or default path
function getServiceAccount() {
  const path =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    join(projectRoot, "serviceAccountKey.json");
  if (!existsSync(path)) {
    console.error(
      "Missing service account key. Set GOOGLE_APPLICATION_CREDENTIALS or add serviceAccountKey.json to project root."
    );
    console.error("Get it from: Firebase Console → Project settings → Service accounts → Generate new private key");
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

// Initialize Firebase Admin (use projectId from key if not in env)
const serviceAccount = getServiceAccount();
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const auth = admin.auth();
const db = admin.firestore();

const SAMPLE_WISHES = [
  "I wish for peace and happiness every day.",
  "I wish to travel the world one day.",
  "I wish for good health for my family.",
  "I wish to learn something new every week.",
  "I wish for more stars in the sky tonight.",
  "I wish to make someone smile today.",
  "I wish for a quiet morning with coffee.",
  "I wish to finish what I started.",
  "I wish for courage to try new things.",
  "I wish for a garden full of flowers.",
  "I wish to see the northern lights.",
  "I wish for more time with friends.",
  "I wish for a good night's sleep.",
  "I wish to read more books this year.",
  "I wish for sunny days ahead.",
  "I wish to be kind to myself.",
  "I wish for a world without hunger.",
  "I wish to hear from an old friend.",
  "I wish for a cozy rainy day.",
  "I wish to dance in the rain.",
  "I wish for success in my goals.",
  "I wish for laughter every day.",
  "I wish to help someone in need.",
  "I wish for a peaceful mind.",
  "I wish to see the ocean again.",
  "I wish for fresh starts.",
  "I wish for love and connection.",
  "I wish to never stop learning.",
  "I wish for moments of wonder.",
  "I wish for a star to wish upon.",
  "I wish for clarity when I need it.",
  "I wish for strength during hard times.",
  "I wish for music that moves me.",
  "I wish for a home full of warmth.",
  "I wish for adventures big and small.",
  "I wish for gratitude in my heart.",
  "I wish for dreams that come true.",
  "I wish for a better tomorrow.",
  "I wish for the courage to speak up.",
  "I wish for quiet nights under the stars.",
  "I wish for creativity that never ends.",
  "I wish for patience with myself.",
  "I wish for snow in winter.",
  "I wish for autumn leaves and warm tea.",
  "I wish for spring blossoms.",
  "I wish for summer nights and fireflies.",
  "I wish for a moment to breathe.",
  "I wish for hope when things are dark.",
  "I wish for friendship that lasts.",
  "I wish for a chance to start over.",
  "I wish for wisdom as I grow.",
  "I wish for the ocean breeze.",
  "I wish for mountains and wide skies.",
  "I wish for a good story to read.",
  "I wish for a song that fits my mood.",
  "I wish for a walk in the park.",
  "I wish for breakfast in bed.",
  "I wish for a day without worry.",
  "I wish for someone to understand.",
  "I wish for a hug when I need it.",
  "I wish for stars to guide the way.",
  "I wish for peace in the world.",
  "I wish for clean air and green earth.",
  "I wish for animals to be safe.",
  "I wish for children to dream big.",
  "I wish for elders to be honored.",
  "I wish for bridges not walls.",
  "I wish for more kindness everywhere.",
  "I wish for a smile from a stranger.",
  "I wish for a compliment that sticks.",
  "I wish for a surprise that delights.",
  "I wish for a letter in the mail.",
  "I wish for a call from a friend.",
  "I wish for a meal shared with love.",
  "I wish for a sunset that takes my breath.",
  "I wish for a sunrise full of hope.",
  "I wish for the moon and the stars.",
  "I wish for this moment to last.",
  "I wish for memories that stay.",
  "I wish for a path that leads forward.",
  "I wish for doors that open.",
  "I wish for second chances.",
  "I wish for forgiveness and grace.",
  "I wish for truth and honesty.",
  "I wish for beauty in small things.",
  "I wish for magic in the ordinary.",
  "I wish for a wish that comes true.",
  "I wish for 100 more wishes.",
  "I wish for everyone to have a wish.",
  "I wish for WishSpace to be full of stars.",
  "I wish for you to be happy.",
  "I wish for today to be good.",
  "I wish for tomorrow to be better.",
  "I wish for peace of mind.",
  "I wish for love to win.",
  "I wish for dreams to never end.",
  "I wish for hope to never fade.",
  "I wish for light in the dark.",
  "I wish for warmth in the cold.",
  "I wish for joy in simple things.",
  "I wish for the best for everyone.",
  "I wish for a world full of wishes.",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

async function main() {
  const total = 100;
  const password = "SeedPass123!"; // Same password for all seed accounts (change if needed)

  console.log("Creating 100 users and 100 wishes...");

  for (let i = 0; i < total; i++) {
    const email = `wishspace.seed.${i + 1}@example.com`;
    const username = `user${i + 1}`;

    try {
      // Create Auth user (or get existing by uid)
      let user;
      try {
        user = await auth.createUser({
          email,
          password,
          displayName: username,
          emailVerified: true,
        });
      } catch (e) {
        if (e.code === "auth/email-already-exists") {
          user = await auth.getUserByEmail(email);
        } else throw e;
      }

      const uid = user.uid;

      // User doc in Firestore
      await db.collection("users").doc(uid).set(
        {
          username,
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // One wish per user
      const wishText = pickRandom(SAMPLE_WISHES);
      const isAnonymous = Math.random() > 0.7;
      await db.collection("wishes").add({
        text: wishText,
        userId: uid,
        username: isAnonymous ? "Anonymous" : username,
        isAnonymous,
        x: randomBetween(0, 100),
        y: randomBetween(0, 100),
        likeCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      if ((i + 1) % 10 === 0) {
        console.log(`  ${i + 1}/${total} users and wishes created.`);
      }
    } catch (err) {
      console.error(`Failed at i=${i + 1} (${email}):`, err.message);
      throw err;
    }
  }

  console.log("Done. 100 users and 100 wishes added to Firebase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
