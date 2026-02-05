/**
 * Space page entry – init space (auth, wishes, UI).
 */
import { initSpace } from "./ts/space";
import { signOut } from "./ts/auth";
import { initSpaceDots } from "./ts/ui";

initSpaceDots(80);
initSpace();

document.getElementById("btn-logout")?.addEventListener("click", async () => {
  await signOut();
  window.location.href = "/login.html";
});
