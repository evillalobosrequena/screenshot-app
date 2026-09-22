(() => {
  "use strict";

  const DB_NAME = "screenshot-app-db";
  const DB_VERSION = 1;
  const STORE_NAME = "images";
  const RECORD_KEY = "current"; // single fixed key -> enforces single-item storage

  let dbPromise = null;
  let currentObjectUrl = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function saveImage(blob) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(blob, RECORD_KEY); // overwrite: same key replaces previous entry

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadImage() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(RECORD_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // UI elements
  const viewerMode = document.getElementById("viewer-mode");
  const uploadMode = document.getElementById("upload-mode");
  const storedImage = document.getElementById("stored-image");
  const fileInput = document.getElementById("file-input");
  const replaceBtn = document.getElementById("replace-btn");

  function showViewer(blob) {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
    }
    currentObjectUrl = URL.createObjectURL(blob);
    storedImage.src = currentObjectUrl;

    viewerMode.classList.remove("hidden");
    uploadMode.classList.add("hidden");
  }

  function showUpload() {
    viewerMode.classList.add("hidden");
    uploadMode.classList.remove("hidden");
  }

  async function handleFileSelected(file) {
    if (!file || !file.type.startsWith("image/")) return;
    await saveImage(file);
    showViewer(file);
    fileInput.value = "";
  }

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    handleFileSelected(file);
  });

  replaceBtn.addEventListener("click", () => {
    showUpload();
  });

  async function init() {
    try {
      const blob = await loadImage();
      if (blob) {
        showViewer(blob);
      } else {
        showUpload();
      }
    } catch (err) {
      console.error("Failed to load stored image:", err);
      showUpload();
    }
  }

  init();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    });
  }
})();
