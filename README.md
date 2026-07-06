# Kojo Codelabs - Interactive Codelab Portal

Welcome to **Kojo Codelabs**! This repository contains a step-by-step interactive portal designed to host multiple technical workshops and codelabs.

---

## ✨ Features

- **Scalable Codelab Hub**: A beautiful, premium homepage dashboard displaying all available codelabs with search filters, category tags, and duration estimates.
- **Dynamic Search & Filtering**: Instantly search through codelabs by title or filter them using categories (e.g. Introduction, Agent Orchestration, Integrations).
- **Dynamic Navigation & Hash Routing**: Automatically synchronizes the URL hash (e.g. `#codelab/orchestrating-parallel-agents/step-3`) with step contents, supporting browser back/forward buttons and direct step linking.
- **Auto-Saving Progress**: Syncs checklist completions and active progress to `localStorage` per-codelab. Users can safely refresh without losing their place.
- **Copy-to-Clipboard Utility**: Integrated copy buttons on code blocks with quick visual feedback state.
- **Light & Dark Mode**: Modern dark theme by default, toggles to light mode with a smooth visual transition.
- **Fluid Responsiveness**: Flexbox/Grid architecture that collapses the sidebar into an overlay drawer menu on mobile devices.
- **Celebration Confetti**: Embedded high-performance canvas particle system triggers once attendees finish the final step of a codelab.

---

## 📁 Repository Structure

```text
├── index.html        # Main HTML layout shell
├── styles.css        # Custom HSL design system stylesheet
├── app.js            # Router logic, progress, storage, homepage rendering, and confetti
├── content.js        # Codelabs list containing steps, metadata, and HTML contents
├── package.json      # NPM start server commands metadata
└── README.md         # Documentation guide
```

---

## 🛠️ Local Development

Since this application is built with standard Vanilla HTML5, CSS3, and ES6 JavaScript, there are **no build steps** or compiler requirements.

### Option 1: Double-Click
Simply double-click the `index.html` file to open and run it directly in any modern web browser.

### Option 2: Local Web Server (Recommended)
To run a clean local development server on `http://localhost:3000`:

1. Open your terminal in this directory.
2. Initialize or run via NPM:
   ```bash
   npm start
   ```

---

## 📝 Adding a New Codelab

To add a new codelab to the portal, simply open [content.js](file:///c:/Users/Kojo%20Shaddy/Desktop/Shaddy/Web/kojo-codelab/content.js) and append a new codelab object to the `window.CODELABS_DATA` array.

### Schema Format

```javascript
{
  id: "unique-slug-id",
  title: "Codelab Title",
  author: "Author Name",
  category: "Category Name",
  description: "A short, engaging description for the card grid.",
  icon: "🚀", // Emoji icon
  steps: [
    {
      id: 1,
      title: "Step Title",
      duration: 5, // duration in minutes
      contentHtml: `
        <p>Instructions and content HTML here...</p>
        
        <h2>Checklist</h2>
        <label class="checklist-item">
          <input type="checkbox" class="checklist-checkbox" data-checklist-id="unique-checklist-item-id">
          <span class="checklist-text">Perform action item description</span>
        </label>
      `
    }
  ]
}
```

---

## 📝 License

This project is licensed under the MIT License.
