/**
 * Register page entry – auth check, form submit, redirect to space after signup.
 */
import { subscribeAuth, signUp } from "./ts/auth";

const form = document.getElementById("form-register") as HTMLFormElement | null;
const usernameInput = document.getElementById("register-username") as HTMLInputElement | null;
const emailInput = document.getElementById("register-email") as HTMLInputElement | null;
const passwordInput = document.getElementById("register-password") as HTMLInputElement | null;
const errorEl = document.getElementById("register-error");

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
  const username = usernameInput?.value?.trim() ?? "";
  const email = emailInput?.value?.trim() ?? "";
  const password = passwordInput?.value ?? "";
  if (!username || !email || !password) {
    isSubmitting = false;
    return;
  }
  if (errorEl) errorEl.textContent = "";
  try {
    await signUp(email, password, username);
    // Redirect after successful registration
    window.location.href = "/space.html";
  } catch (err: unknown) {
    isSubmitting = false;
    const message = err instanceof Error ? err.message : "Registration failed";
    if (errorEl) errorEl.textContent = message;
  }
});
