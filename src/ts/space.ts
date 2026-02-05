/**
 * Space page logic – render stars, handle star click, create/listen to wishes.
 * Coordinates between wishes data and UI (ui.ts).
 */

import { getCurrentUser, subscribeAuth, getUserProfile } from "./auth";
import { subscribeWishes, createWish, likeWish, hasLiked, getWish } from "./wishes";
import {
  renderStars,
  openCreateWishModalFn,
  openWishModal,
  closeCreateWishModal,
  setCreateWishSubmitHandler,
  setWishModalLikeHandler,
  setWishModalContent,
  getCreateWishFormData,
  bindCreateWishUI,
} from "./ui";

let unsubscribeWishes: (() => void) | null = null;

/**
 * Initialize space: require auth (redirect to login if not signed in),
 * bind create-wish and wish modals, subscribe to Firestore wishes in real time.
 * New/updated wishes re-render stars automatically.
 */

let authUnsubscribe: (() => void) | null = null;

export function initSpace(): void {
  // Use subscribeAuth to wait for auth state to be determined
  authUnsubscribe = subscribeAuth((user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }

    // User is authenticated, initialize the space
    bindCreateWishUI();
    setCreateWishSubmitHandler(handleCreateWish);
    document.getElementById("btn-create-wish")?.addEventListener("click", openCreateWishModalFn);

    unsubscribeWishes = subscribeWishes((wishes) => {
      renderStars(wishes, onStarClick);
    });
  });
}

/** Handle star click: fetch wish and open modal with like support. */
async function onStarClick(wishId: string): Promise<void> {
  const wish = await getWish(wishId);
  if (!wish) return;

  const user = getCurrentUser();
  const liked = user ? await hasLiked(wishId, user.uid) : false;

  setWishModalContent({
    wishId: wish.id,
    text: wish.text,
    authorName: wish.isAnonymous ? "Anonymous" : wish.username,
    likeCount: wish.likeCount,
    alreadyLiked: liked,
  });

  setWishModalLikeHandler(async () => {
    if (!user) return;
    await likeWish(wish.id, user.uid);
    const updated = await getWish(wish.id);
    if (updated) {
      setWishModalContent({
        wishId: updated.id,
        text: updated.text,
        authorName: updated.isAnonymous ? "Anonymous" : updated.username,
        likeCount: updated.likeCount,
        alreadyLiked: true,
      });
    }
  });

  openWishModal();
}

/** Handle create wish form submit. */
async function handleCreateWish(): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;

  const profile = await getUserProfile(user.uid);
  const username = profile?.username ?? "Anonymous";

  const { text, isAnonymous } = getCreateWishFormData();
  if (!text.trim()) return;

  await createWish(user.uid, username, text, isAnonymous);
  closeCreateWishModal();
}

/** Cleanup on leave (if needed). */
export function destroySpace(): void {
  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }
  if (unsubscribeWishes) {
    unsubscribeWishes();
    unsubscribeWishes = null;
  }
}
