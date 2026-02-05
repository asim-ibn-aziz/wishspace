/**
 * Login page entry – auth check, form submit, redirect to space if already logged in.
 */
import { subscribeAuth, signIn } from "./ts/auth";

const form = document.getElementById("form-login") as HTMLFormElement | null;
const emailInput = document.getElementById("login-email") as HTMLInputElement | null;
const passwordInput = document.getElementById("login-password") as HTMLInputElement | null;
const errorEl = document.getElementById("login-error");

// Only redirect if user is already logged in (not during form submit)
let isSubmitting = false;
subscribeAuth((user) => {
  if (user && !isSubmitting) {
    // Small delay to prevent immediate redirect during page load
    setTimeout(() => {
      if (!isSubmitting) {
        window.location.href = "/space.html";
      }
    }, 100);
  }
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  isSubmitting = true;
  const email = emailInput?.value?.trim() ?? "";
  const password = passwordInput?.value ?? "";
  if (!email || !password) {
    isSubmitting = false;
    return;
  }
  if (errorEl) errorEl.textContent = "";
  try {
    await signIn(email, password);
    // Redirect after successful login
    window.location.href = "/space.html";
  } catch (err: unknown) {
    isSubmitting = false;
    const message = err instanceof Error ? err.message : "Login failed";
    if (errorEl) errorEl.textContent = message;
  }
});
