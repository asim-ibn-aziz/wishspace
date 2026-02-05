/**
 * UI helpers – modals, star DOM, form data.
 * No inline JS; all DOM and event binding from here.
 */

import type { Wish } from "./types";
import { MAX_WISH_LENGTH } from "./types";

const SPACE_STARS_CONTAINER_ID = "space-stars";
const MODAL_WISH_ID = "modal-wish";
const MODAL_CREATE_ID = "modal-create-wish";
const MODAL_WISH_CLOSE_ID = "modal-wish-close";
const MODAL_CREATE_CLOSE_ID = "modal-create-close";
const MODAL_WISH_TEXT_ID = "modal-wish-text";
const MODAL_WISH_AUTHOR_ID = "modal-wish-author";
const MODAL_WISH_LIKE_ID = "modal-wish-like";
const MODAL_WISH_LIKE_COUNT_ID = "modal-wish-like-count";
const CREATE_TEXTAREA_ID = "create-wish-text";
const CREATE_ANONYMOUS_ID = "create-wish-anonymous";
const CREATE_SUBMIT_ID = "create-wish-submit";
const CREATE_CHAR_COUNT_ID = "create-wish-char-count";

let createWishSubmitHandler: (() => Promise<void>) | null = null;
let wishModalLikeHandler: (() => Promise<void>) | null = null;

/** Get container for stars. */
function getStarsContainer(): HTMLElement | null {
  return document.getElementById(SPACE_STARS_CONTAINER_ID);
}

/** Map likeCount to star size (min/max in rem). */
function getStarSize(likeCount: number): number {
  const min = 0.8;
  const max = 2.2;
  const scale = Math.min(likeCount * 0.15, 1);
  return min + scale * (max - min);
}

/** Map likeCount to glow intensity (opacity). */
function getGlowOpacity(likeCount: number): number {
  return 0.3 + Math.min(likeCount * 0.05, 0.5);
}

/** Real star emoji (⭐) for wishes. */
const STAR_EMOJI = "⭐";

/** Create a single star element – real star emoji with glow. */
function createStarElement(wish: Wish, onClick: (wishId: string) => void): HTMLElement {
  const size = getStarSize(wish.likeCount);
  const glow = getGlowOpacity(wish.likeCount);
  const blurPx = 8 + wish.likeCount * 2;
  const star = document.createElement("button");
  star.type = "button";
  star.className =
    "wish-star absolute cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded-full animate-twinkle star-fade-in flex items-center justify-center border-0 bg-transparent";
  star.style.left = `${wish.x}%`;
  star.style.top = `${wish.y}%`;
  star.style.width = `${size}rem`;
  star.style.height = `${size}rem`;
  star.style.transform = "translate(-50%, -50%)";
  star.style.fontSize = `${size * 0.7}rem`;
  star.style.lineHeight = "1";
  star.style.textShadow = `0 0 ${blurPx}px rgba(255, 215, 0, ${glow}), 0 0 ${blurPx * 2}px rgba(255, 235, 150, ${glow * 0.6})`;
  star.textContent = STAR_EMOJI;
  star.setAttribute("data-wish-id", wish.id);
  const safeText = wish.text.replace(/\s+/g, " ").trim().slice(0, 30);
  star.setAttribute("aria-label", `Wish: ${safeText}${wish.text.length > 30 ? "..." : ""}`);
  star.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick(wish.id);
  });
  star.addEventListener("mouseenter", () => {
    star.style.textShadow = `0 0 16px rgba(255, 215, 0, ${Math.min(glow + 0.4, 1)}), 0 0 28px rgba(255, 235, 150, ${Math.min(glow + 0.3, 1)})`;
  });
  star.addEventListener("mouseleave", () => {
    star.style.textShadow = `0 0 ${blurPx}px rgba(255, 215, 0, ${glow}), 0 0 ${blurPx * 2}px rgba(255, 235, 150, ${glow * 0.6})`;
  });
  return star;
}

/** Render all stars into the space container. */
export function renderStars(wishes: Wish[], onStarClick: (wishId: string) => void): void {
  const container = getStarsContainer();
  if (!container) return;
  container.innerHTML = "";
  wishes.forEach((wish) => {
    container.appendChild(createStarElement(wish, onStarClick));
  });
}

/** Fill the space background with slowly drifting white dots. */
export function initSpaceDots(count: number = 80): void {
  const container = document.getElementById("space-dots");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "space-dot";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 20}s`;
    container.appendChild(dot);
  }
}

/** Open wish detail modal. */
export function openWishModal(): void {
  const modal = document.getElementById(MODAL_WISH_ID);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("animate-zoom-in");
  }
}

/** Close wish modal. */
export function closeWishModal(): void {
  const modal = document.getElementById(MODAL_WISH_ID);
  if (modal) modal.classList.add("hidden");
}

/** Set wish modal content (text, author, like count, liked state). */
export interface WishModalContent {
  wishId: string;
  text: string;
  authorName: string;
  likeCount: number;
  alreadyLiked: boolean;
}

export function setWishModalContent(data: WishModalContent): void {
  const textEl = document.getElementById(MODAL_WISH_TEXT_ID);
  const authorEl = document.getElementById(MODAL_WISH_AUTHOR_ID);
  const likeBtn = document.getElementById(MODAL_WISH_LIKE_ID);
  const countEl = document.getElementById(MODAL_WISH_LIKE_COUNT_ID);
  if (textEl) textEl.textContent = data.text;
  if (authorEl) authorEl.textContent = data.authorName;
  if (countEl) countEl.textContent = String(data.likeCount);
  if (likeBtn) {
    // Toggle classes separately (classList.toggle only accepts one class at a time)
    if (data.alreadyLiked) {
      likeBtn.classList.add("opacity-50", "cursor-not-allowed");
      likeBtn.classList.remove("hover:scale-105");
    } else {
      likeBtn.classList.remove("opacity-50", "cursor-not-allowed");
      likeBtn.classList.add("hover:scale-105");
    }
    (likeBtn as HTMLButtonElement).disabled = data.alreadyLiked;
  }
}

/** Set handler for like button in wish modal. */
export function setWishModalLikeHandler(handler: () => Promise<void>): void {
  wishModalLikeHandler = handler;
}

/** Open create wish modal. */
export function openCreateWishModalFn(): void {
  const modal = document.getElementById(MODAL_CREATE_ID);
  const textarea = document.getElementById(CREATE_TEXTAREA_ID) as HTMLTextAreaElement | null;
  const charCount = document.getElementById(CREATE_CHAR_COUNT_ID);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("animate-fade-in-scale");
  }
  if (textarea) {
    textarea.value = "";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
  if (charCount) charCount.textContent = `0 / ${MAX_WISH_LENGTH}`;
}

/** Close create wish modal. */
export function closeCreateWishModal(): void {
  const modal = document.getElementById(MODAL_CREATE_ID);
  if (modal) modal.classList.add("hidden");
}

/** Set submit handler for create wish form (called from space.ts before bindCreateWishUI). */
export function setCreateWishSubmitHandler(handler: () => Promise<void>): void {
  createWishSubmitHandler = handler;
}

/** Get create wish form data. */
export function getCreateWishFormData(): { text: string; isAnonymous: boolean } {
  const textarea = document.getElementById(CREATE_TEXTAREA_ID) as HTMLTextAreaElement | null;
  const anonymous = document.getElementById(CREATE_ANONYMOUS_ID) as HTMLInputElement | null;
  return {
    text: textarea?.value ?? "",
    isAnonymous: anonymous?.checked ?? false,
  };
}

/** Bind create wish char counter and modal close/clicks outside. */
export function bindCreateWishUI(): void {
  const textarea = document.getElementById(CREATE_TEXTAREA_ID) as HTMLTextAreaElement | null;
  const charCount = document.getElementById(CREATE_CHAR_COUNT_ID);
  if (textarea && charCount) {
    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      charCount.textContent = `${len} / ${MAX_WISH_LENGTH}`;
      if (len > MAX_WISH_LENGTH) textarea.value = textarea.value.slice(0, MAX_WISH_LENGTH);
    });
  }

  document.getElementById(MODAL_CREATE_CLOSE_ID)?.addEventListener("click", closeCreateWishModal);
  document.getElementById(MODAL_WISH_CLOSE_ID)?.addEventListener("click", closeWishModal);

  document.getElementById(CREATE_SUBMIT_ID)?.addEventListener("click", (e) => {
    e.preventDefault();
    createWishSubmitHandler?.();
  });
  document.getElementById("form-create-wish")?.addEventListener("submit", (e) => {
    e.preventDefault();
    createWishSubmitHandler?.();
  });

  document.getElementById(MODAL_WISH_LIKE_ID)?.addEventListener("click", () => {
    wishModalLikeHandler?.();
  });

  const overlayWish = document.getElementById("modal-wish-overlay");
  const overlayCreate = document.getElementById("modal-create-overlay");
  overlayWish?.addEventListener("click", closeWishModal);
  overlayCreate?.addEventListener("click", closeCreateWishModal);
}
