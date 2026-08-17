import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const startup = document.getElementById("forge-startup");
if (startup) {
  const elapsed = performance.now() - (window.__forgeStartupAt || 0);
  window.setTimeout(() => {
    requestAnimationFrame(() => {
      startup.classList.add("forge-startup--leaving");
      window.setTimeout(() => startup.remove(), 420);
    });
  }, Math.max(0, 650 - elapsed));
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => {
      console.error("offline setup failed", error);
    });
  });
}
