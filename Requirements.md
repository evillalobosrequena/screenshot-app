# Requirements: Single-Screenshot PWA

## 1. Project Overview
A frontend-only Progressive Web App (PWA) designed to store and display exactly one screenshot or image for instant, offline access. Uploading a new image permanently replaces the existing one.

## 2. Functional Requirements
- **PWA Capabilities:** Installable on iOS/Android via Safari/Chrome. 100% offline functionality.
- **Single Item Storage:** The app holds only one image at a time.
- **Supported Formats:** Images only (JPG, PNG, WebP, etc.).
- **Overwrite Mechanism:** Adding a new image immediately deletes the previous one from storage.
- **Default View:** If an image exists, the app opens directly to the viewing mode. If empty, it opens the upload mode.

## 3. Technical Requirements
- **Stack:** Vanilla HTML, CSS (mobile-first), and JavaScript. No build tools.
- **Storage mechanism:** Use `IndexedDB` to handle image binary data (Blobs) efficiently.
- **Offline support:** Implement a `sw.js` (Service Worker) to cache the app shell (`index.html`, `styles.css`, `app.js`, `manifest.json`, icons) and serve it cache-first.

## 4. UI/UX Specifications
- **Minimalist Design:** Dark background recommended so the screenshot stands out without distractions.
- **State 1: Viewer Mode:** Displays the stored screenshot. The image should be contained within the screen (`object-fit: contain`). Includes a "Replace" button at the bottom.
- **State 2: Upload Mode:** Shows a file input explicitly configured to accept images, which on iOS will prompt to open the Photo Library or Camera.
- **Responsive:** Optimized for mobile screens.

## 5. File Structure Expected
- `index.html` (UI and PWA meta tags)
- `styles.css` (Styling)
- `app.js` (IndexedDB logic and UI state management)
- `sw.js` (Service worker for offline caching)
- `manifest.json` (PWA manifest)