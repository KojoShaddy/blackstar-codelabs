# BlackStar CodeLabs | Practical Google Cloud AI Codelabs

Welcome to **BlackStar CodeLabs**! This repository hosts a step-by-step interactive portal designed to deliver high-quality, practical workshops and technical codelabs for developers building with Google Cloud AI technologies.

---

## 🛠️ Local Development

Since the portal is built using standard Vanilla HTML5, CSS3, and ES6 JavaScript, there are no build steps or compiler requirements.

### Option 1: Static Loading
Simply double-click the `index.html` file to open and run it directly in any modern web browser.

### Option 2: Local Web Server (Recommended)
To run a clean local development server on `http://localhost:3000`:

1. Open your terminal in this directory.
2. Start the local server:
   ```bash
   npm start
   ```

---

## 📝 Adding a New Codelab

To add a new workshop to the portal, open [js/content.js](file:///c:/Users/Kojo%20Shaddy/Desktop/Shaddy/Web/blackstar-codelabs/js/content.js) and append a new codelab object to the `window.CODELABS_DATA` array.

### Schema Format

```javascript
{
  id: "unique-slug-id",
  title: "Codelab Title",
  author: "Author Name",
  category: "Category Name",
  description: "A short, engaging description for the card grid.",
  icon: "🚀", // Emoji icon
  completionTitle: "Course Title Completed!", // Title shown on the final celebration screen
  completionMessage: "Congratulations paragraph shown to the user on completion.",
  steps: [
    {
      id: 1,
      title: "Step Title",
      duration: 5, // Estimated duration in minutes
      contentHtml: `
        <p>Step instructions and technical specifications in HTML...</p>
      `
    }
  ]
}
```

---

## 👥 Contributors

- **Shadrack Inusah** ([@KojoShaddy](https://github.com/KojoShaddy)) - Core Developer & Architect
- **Gabriel Agbobli** ([@gabbyagbobli](https://github.com/gabbyagbobli)) - Course Design & Content Contributor

---

## 📝 License

This project is licensed under the MIT License.
