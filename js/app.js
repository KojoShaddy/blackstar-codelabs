// Codelab Application Script - Blackstar Codelabs

// State variables
let currentStepIndex = 0;
let stepsData = [];
let checkedItems = {};
let activeCodelab = null;
let activeCodelabId = "";
let currentSearchQuery = "";
let activeCategoryFilter = "All";

// On DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  initTheme();
  setupEventListeners();
  handleRouting();
});

// Initialize App
function initApp() {
  if (!window.CODELABS_DATA) {
    console.error("Codelab content data not found. Please verify content.js is loaded.");
    return;
  }
}

// Initialize Theme (Dark/Light mode)
function initTheme() {
  const savedTheme = localStorage.getItem("codelab_theme") || "dark"; // Default to dark for premium feel
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeToggleIcon(savedTheme);
}

// Setup Event Listeners
function setupEventListeners() {
  // Theme Toggle Button
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Footer Navigation Buttons
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  if (btnPrev) {
    btnPrev.addEventListener("click", () => navigateToStep(currentStepIndex - 1));
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (currentStepIndex === stepsData.length - 1) {
        // Complete Codelab -> Show dedicated completion page!
        showCompletionPage();
      } else {
        navigateToStep(currentStepIndex + 1);
      }
    });
  }

  // Mobile Hamburger Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (mobileToggle && sidebar && overlay) {
    const toggleMobileNav = () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("active");
    };

    mobileToggle.addEventListener("click", toggleMobileNav);
    overlay.addEventListener("click", toggleMobileNav);
  }

  // Listen to hash changes in URL
  window.addEventListener("hashchange", handleRouting);

  // Keyboard navigation listener (Left/Right arrow keys)
  document.addEventListener("keydown", (e) => {
    // Only navigate if inside a codelab step and not typing in a text field
    if (!activeCodelab || window.location.hash.endsWith("/complete")) return;
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
      return;
    }
    if (e.key === "ArrowLeft") {
      if (currentStepIndex > 0) navigateToStep(currentStepIndex - 1);
    } else if (e.key === "ArrowRight") {
      if (currentStepIndex < stepsData.length - 1) navigateToStep(currentStepIndex + 1);
    }
  });
}

// Toggle Theme between dark and light
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("codelab_theme", newTheme);
  updateThemeToggleIcon(newTheme);
}

// Update Theme Toggle Button Icon based on Theme
function updateThemeToggleIcon(theme) {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  if (theme === "dark") {
    // Moon icon to Sun icon
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41z"/>
      </svg>
    `;
  } else {
    // Sun icon to Moon icon
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
      </svg>
    `;
  }
}

// Handle routing from URL hash values
function handleRouting() {
  const hash = window.location.hash;

  if (!hash || hash === "#" || hash === "#home") {
    showHomepage();
    return;
  }

  // Matches #codelab/{codelabId}/complete
  const completeMatch = hash.match(/^#codelab\/([^\/]+)\/complete$/);
  if (completeMatch) {
    const codelabId = completeMatch[1];
    const foundCodelab = window.CODELABS_DATA.find(c => c.id === codelabId);
    if (foundCodelab) {
      activeCodelab = foundCodelab;
      activeCodelabId = foundCodelab.id;
      stepsData = foundCodelab.steps;

      // Show codelab view container, hide homepage
      const homeView = document.getElementById("home-view");
      const codelabView = document.getElementById("codelab-view");
      const headerProgress = document.getElementById("header-progress");
      if (homeView) homeView.classList.add("hidden");
      if (codelabView) codelabView.classList.remove("hidden");
      if (headerProgress) headerProgress.classList.remove("hidden");

      showCompletionPage();
      return;
    }
  }

  // Matches #codelab/{codelabId}/step/{stepNum}
  const match = hash.match(/^#codelab\/([^\/]+)\/step\/(\d+)$/);
  if (match) {
    const codelabId = match[1];
    const stepNum = parseInt(match[2], 10);
    
    const foundCodelab = window.CODELABS_DATA.find(c => c.id === codelabId);
    if (foundCodelab) {
      loadCodelab(foundCodelab, stepNum - 1);
      return;
    }
  }

  // Fallback to home
  window.location.hash = "#home";
}

// Show the homepage view
function showHomepage() {
  // Hide codelab workspace
  const codelabView = document.getElementById("codelab-view");
  const headerProgress = document.getElementById("header-progress");
  if (codelabView) codelabView.classList.add("hidden");
  if (headerProgress) headerProgress.classList.add("hidden");

  // Show home view
  const homeView = document.getElementById("home-view");
  if (homeView) homeView.classList.remove("hidden");

  // Reset state variables
  activeCodelab = null;
  activeCodelabId = "";
  stepsData = [];
  currentStepIndex = 0;

  // Set default page title
  document.title = "BlackStar CodeLabs | Practical Google Cloud AI Codelabs";
  const headerTitle = document.getElementById("header-title");
  if (headerTitle) headerTitle.textContent = "Interactive Portal";

  renderHomepage();
}

// Render the homepage layout
function renderHomepage() {
  const homeView = document.getElementById("home-view");
  if (!homeView) return;

  const categories = ["All", ...new Set(window.CODELABS_DATA.map(c => c.category))];

  homeView.innerHTML = `
    <div class="home-hero">
      <h1>Explore Blackstar Codelabs</h1>
      <p>Interactive, step-by-step programming workshops designed to build code, run autonomous agents, and orchestrate tools safely.</p>
    </div>

    <div class="search-filter-wrapper">
      <div class="search-input-container">
        <svg class="search-icon-svg" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input type="text" id="search-bar" class="search-input" placeholder="Search codelabs..." value="${currentSearchQuery}">
      </div>
      <div class="filter-pills">
        <span class="filter-label">Filter:</span>
        ${categories.map(cat => `
          <button class="filter-pill ${activeCategoryFilter === cat ? "active" : ""}" data-category="${cat}">${cat}</button>
        `).join("")}
      </div>
    </div>

    <div id="codelabs-grid" class="codelabs-grid"></div>
  `;

  renderCardsGrid();

  // Attach search and filter event listeners
  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    searchBar.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      renderCardsGrid();
    });

    if (currentSearchQuery) {
      searchBar.focus();
      searchBar.setSelectionRange(currentSearchQuery.length, currentSearchQuery.length);
    }
  }

  const pills = document.querySelectorAll(".filter-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategoryFilter = pill.getAttribute("data-category");
      renderCardsGrid();
    });
  });
}

// Render filtered codelabs inside grid
function renderCardsGrid() {
  const grid = document.getElementById("codelabs-grid");
  if (!grid) return;

  const filteredCodelabs = window.CODELABS_DATA.filter(codelab => {
    const matchesSearch = codelab.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          codelab.description.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          codelab.category.toLowerCase().includes(currentSearchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === "All" || codelab.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (filteredCodelabs.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No Codelabs Found</h3>
        <p>Try matching other words or checking category filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredCodelabs.map(codelab => {
    const totalDuration = codelab.steps.reduce((sum, s) => sum + s.duration, 0);
    const stepCount = codelab.steps.length;
    return `
      <div class="codelab-card" data-codelab-id="${codelab.id}">
        <div class="card-top">
          <div class="card-icon">${codelab.icon || "💻"}</div>
          <span class="card-badge">${codelab.category}</span>
        </div>
        <h2>${codelab.title}</h2>
        <p class="card-desc">${codelab.description}</p>
        <div class="card-meta">
          <span class="card-duration">⏳ ${totalDuration} mins • ${stepCount} steps</span>
          <span class="card-author">${codelab.author}</span>
        </div>
      </div>
    `;
  }).join("");

  const cards = grid.querySelectorAll(".codelab-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-codelab-id");
      window.location.hash = `#codelab/${id}/step/1`;
    });
  });
}

// Load a specific codelab configuration
function loadCodelab(codelab, stepIdx) {
  activeCodelab = codelab;
  activeCodelabId = codelab.id;
  stepsData = codelab.steps;

  // Show codelab view, hide homepage
  const homeView = document.getElementById("home-view");
  const codelabView = document.getElementById("codelab-view");
  const headerProgress = document.getElementById("header-progress");
  if (homeView) homeView.classList.add("hidden");
  if (codelabView) codelabView.classList.remove("hidden");
  if (headerProgress) headerProgress.classList.remove("hidden");

  // Restore sidebar and footer in case we navigated from complete state
  const sidebar = document.getElementById("sidebar");
  const footerControls = document.getElementById("footer-controls");
  if (sidebar) sidebar.classList.remove("hidden");
  if (footerControls) footerControls.classList.remove("hidden");

  // Set titles
  document.title = `${codelab.title} | BlackStar CodeLabs`;
  const headerTitle = document.getElementById("header-title");
  if (headerTitle) headerTitle.textContent = codelab.title;

  const sidebarCategory = document.getElementById("sidebar-category");
  if (sidebarCategory) sidebarCategory.textContent = codelab.category;

  // Load progress namespaces
  const savedCheckedItems = localStorage.getItem(`codelab_${activeCodelabId}_checked_items`);
  if (savedCheckedItems) {
    try {
      checkedItems = JSON.parse(savedCheckedItems);
    } catch (e) {
      checkedItems = {};
    }
  } else {
    checkedItems = {};
  }

  renderSidebarSteps();
  navigateToStep(stepIdx, false);
}

// Render steps items in the sidebar
function renderSidebarSteps() {
  const listElement = document.getElementById("sidebar-steps-list");
  if (!listElement) return;

  listElement.innerHTML = "";

  stepsData.forEach((step, idx) => {
    const isCompleted = isStepCheckedFully(step.id);
    const li = document.createElement("li");
    li.className = `step-item ${idx === currentStepIndex ? "active" : ""} ${isCompleted ? "completed" : ""}`;
    li.setAttribute("data-step-index", idx);
    li.innerHTML = `
      <div class="step-status-icon">${idx === currentStepIndex || isCompleted ? "" : idx + 1}</div>
      <div class="step-info">
        <span class="step-title" title="${step.title}">${step.title}</span>
        <span class="step-duration">${step.duration} min</span>
      </div>
    `;

    li.addEventListener("click", () => {
      navigateToStep(idx);
      // On mobile, close sidebar when step is clicked
      const sidebar = document.getElementById("sidebar");
      const overlay = document.getElementById("sidebar-overlay");
      if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
      }
    });

    listElement.appendChild(li);
  });
}

// Navigate to step index
function navigateToStep(idx, updateHash = true) {
  if (idx < 0 || idx >= stepsData.length) return;

  currentStepIndex = idx;

  if (updateHash) {
    window.location.hash = `#codelab/${activeCodelabId}/step/${idx + 1}`;
    return; // handleRouting will be called by hashchange listener
  }

  // Update sidebar active highlights
  const sidebarItems = document.querySelectorAll(".step-item");
  sidebarItems.forEach((item, i) => {
    const isCompleted = isStepCheckedFully(stepsData[i].id);
    item.className = `step-item ${i === currentStepIndex ? "active" : ""} ${isCompleted ? "completed" : ""}`;
    const statusIcon = item.querySelector(".step-status-icon");
    if (statusIcon) {
      statusIcon.textContent = i === currentStepIndex || isCompleted ? "" : i + 1;
    }
  });

  // Render content area
  renderStepContent();

  // Scroll content to top
  const contentPanel = document.getElementById("content-panel");
  if (contentPanel) contentPanel.scrollTop = 0;

  // Update progress tracking metrics
  updateProgressMetrics();

  // Update Footer buttons
  updateFooterControls();
}

// Render dynamic content for current step
function renderStepContent() {
  const step = stepsData[currentStepIndex];
  const contentArea = document.getElementById("step-content-area");
  if (!contentArea || !step) return;

  // Fade transition support
  contentArea.style.opacity = 0;

  setTimeout(() => {
    contentArea.innerHTML = `
      <div class="codelab-step-header">
        <div class="codelab-meta">
          <span class="badge badge-step">Step ${step.id} of ${stepsData.length}</span>
          <span class="badge badge-time">⏳ ${step.duration} mins remaining</span>
        </div>
        <h1 class="codelab-step-title">${step.title}</h1>
      </div>
      <div class="codelab-step-body">
        ${step.contentHtml}
      </div>
    `;

    // Initialize checkboxes within rendered content
    setupCheckboxesInContent();
    contentArea.style.opacity = 1;
  }, 100);
}

// Setup checked values for inputs in the newly rendered HTML
function setupCheckboxesInContent() {
  const checkboxes = document.querySelectorAll(".checklist-checkbox");
  checkboxes.forEach((cb) => {
    const checklistId = cb.getAttribute("data-checklist-id");
    
    // Check local storage setting
    if (checkedItems[checklistId]) {
      cb.checked = true;
      cb.closest(".checklist-item")?.classList.add("checked");
    }

    cb.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      const label = cb.closest(".checklist-item");
      
      if (isChecked) {
        label?.classList.add("checked");
        checkedItems[checklistId] = true;
      } else {
        label?.classList.remove("checked");
        delete checkedItems[checklistId];
      }

      // Save to namespaced local storage
      localStorage.setItem(`codelab_${activeCodelabId}_checked_items`, JSON.stringify(checkedItems));

      // Re-evaluate current step completion state & update metrics
      updateStepCompletionStatus(stepsData[currentStepIndex].id);
      updateProgressMetrics();
    });
  });
}

// Determine if a specific step's checklist items are fully completed
function isStepCheckedFully(stepId) {
  const step = stepsData.find(s => s.id === stepId);
  if (!step) return false;

  const stepIdx = stepsData.indexOf(step);
  // If the user has navigated past this step, consider it complete
  if (currentStepIndex > stepIdx) {
    return true;
  }

  // Extract checklist item IDs defined in content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = step.contentHtml;
  const checkboxes = tempDiv.querySelectorAll(".checklist-checkbox");
  
  if (checkboxes.length === 0) {
    // If no checkboxes exist, it is complete if they are on the final step
    return currentStepIndex === stepIdx && stepIdx === stepsData.length - 1;
  }

  // If there are checkboxes, all must be checked in localStorage
  return Array.from(checkboxes).every(cb => {
    const id = cb.getAttribute("data-checklist-id");
    return !!checkedItems[id];
  });
}

// Re-evaluates completions for the sidebar
function updateStepCompletionStatus(stepId) {
  const stepIdx = stepsData.findIndex(s => s.id === stepId);
  if (stepIdx === -1) return;

  const isCompleted = isStepCheckedFully(stepId);
  const sidebarItems = document.querySelectorAll(".step-item");
  const sidebarItem = sidebarItems[stepIdx];

  if (sidebarItem) {
    if (isCompleted) {
      sidebarItem.classList.add("completed");
      const icon = sidebarItem.querySelector(".step-status-icon");
      if (icon) icon.textContent = "";
    } else {
      sidebarItem.classList.remove("completed");
      const icon = sidebarItem.querySelector(".step-status-icon");
      if (icon) icon.textContent = stepIdx === currentStepIndex ? "" : stepIdx + 1;
    }
  }
}

// Calculate progress percentage and total estimated remaining time
function updateProgressMetrics() {
  if (stepsData.length === 0) return;
  
  // Progress Bar percentage is based on the user's reading position in the steps list
  const progressPercent = stepsData.length > 1 
    ? Math.round((currentStepIndex / (stepsData.length - 1)) * 100) 
    : 100;

  const fillElement = document.getElementById("progress-bar-fill");
  const textElement = document.getElementById("progress-info-text");

  if (fillElement) fillElement.style.width = `${progressPercent}%`;
  if (textElement) textElement.textContent = `${progressPercent}% Complete`;

  // Update dynamic duration left badge on content
  let timeRemaining = 0;
  for (let i = currentStepIndex; i < stepsData.length; i++) {
    timeRemaining += stepsData[i].duration;
  }
  const badgeTime = document.querySelector(".badge-time");
  if (badgeTime) {
    badgeTime.textContent = `⏳ ${timeRemaining} mins left`;
  }
}

// Sync Next/Prev buttons
function updateFooterControls() {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  if (btnPrev) {
    btnPrev.disabled = currentStepIndex === 0;
  }

  if (btnNext) {
    if (currentStepIndex === stepsData.length - 1) {
      btnNext.innerHTML = `Finish Codelab 🏆`;
      btnNext.style.background = "var(--gradient-accent)";
    } else {
      btnNext.innerHTML = `Next Step ➔`;
      btnNext.style.background = "var(--gradient-primary)";
    }
  }
}

// Open and render dedicated completion view
function showCompletionPage() {
  // Hide sidebar and footer controls
  const sidebar = document.getElementById("sidebar");
  const footerControls = document.getElementById("footer-controls");
  if (sidebar) sidebar.classList.add("hidden");
  if (footerControls) footerControls.classList.add("hidden");

  // Update window hash state
  window.location.hash = `#codelab/${activeCodelabId}/complete`;

  // Render centered celebration panel
  const contentArea = document.getElementById("step-content-area");
  if (contentArea && activeCodelab) {
    contentArea.innerHTML = `
      <div class="celebration-view" style="max-width: 600px; margin: 4rem auto; text-align: center;">
        <div class="celebration-icon" style="font-size: 5rem; margin-bottom: 2rem;">🎉${activeCodelab.icon || "💻"}</div>
        <h1 class="celebration-title" style="font-size: 3rem; font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1.5rem;">
          ${activeCodelab.completionTitle || (activeCodelab.title + " Completed!")}
        </h1>
        <p class="celebration-text" style="font-size: 1.25rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 2.5rem; max-width: 100%;">
          ${activeCodelab.completionMessage || "Congratulations on finishing the codelab!"}
        </p>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;">
          <button class="btn-share" onclick="shareCodelabCompletion()" style="background: var(--gradient-accent); color: white; padding: 1rem 2.5rem; border-radius: var(--border-radius-sm); border: none; font-family: var(--font-heading); font-weight: 700; font-size: 1.15rem; cursor: pointer; box-shadow: var(--shadow-md); transition: var(--transition-smooth); width: 100%; max-width: 320px;">
            Share on LinkedIn
          </button>
          <button class="control-btn btn-prev" onclick="window.location.hash='#home'" style="border-color: var(--border-color); color: var(--text-secondary); font-size: 0.95rem; background: transparent; padding: 0.75rem 1.5rem; cursor: pointer; border-radius: var(--border-radius-sm);">
            ➔ Back to Dashboard
          </button>
        </div>
      </div>
    `;

    // Smooth transition
    contentArea.style.opacity = 0;
    setTimeout(() => {
      contentArea.style.opacity = 1;
    }, 100);
  }

  // Trigger confetti overlay
  triggerConfetti();
}

// Copy Code Block functionality
window.copyCode = function(btnElement) {
  const preElement = btnElement.closest("pre");
  if (!preElement) return;

  const codeElement = preElement.querySelector("code");
  if (!codeElement) return;

  // Extract raw text
  const textToCopy = codeElement.textContent;

  navigator.clipboard.writeText(textToCopy).then(() => {
    btnElement.textContent = "Copied!";
    btnElement.classList.add("copied");

    setTimeout(() => {
      btnElement.textContent = "Copy";
      btnElement.classList.remove("copied");
    }, 2000);
  }).catch(err => {
    console.error("Could not copy code snippet: ", err);
  });
};

// Celebration Confetti Logic
let confettiActive = false;
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#2563eb", "#7c3aed", "#3b82f6", "#8b5cf6", 
    "#ec4899", "#10b981", "#f59e0b", "#ef4444"
  ];
  
  const particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }

  confettiActive = true;

  function drawConfetti() {
    if (!confettiActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach((p) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      p.tilt = Math.sin(p.tiltAngle - (particles.indexOf(p) / 3)) * 15;

      if (p.y <= canvas.height) {
        activeParticles++;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();

      // Recirculate particle if it falls off bottom
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });

    if (activeParticles > 0) {
      requestAnimationFrame(drawConfetti);
    }
  }

  drawConfetti();

  // Stop confetti animation after 6 seconds
  setTimeout(() => {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 6000);
}

// Window resize handler to sync canvas width/height
window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// Social Share Callback Function
window.shareCodelabCompletion = function() {
  if (!activeCodelab) return;
  const title = activeCodelab.title;
  const url = window.location.origin + window.location.pathname + window.location.hash;
  
  const postTemplate = `🚀 I just completed the "${title}" workshop on Blackstar Codelabs! 💻🔥

In this codelab, I learned how to build and orchestrate autonomous AI agents using Antigravity 2.0 and Gemini 3.5 Flash.

Check out the codelab here: ${url}

#AI #AgenticAI #Antigravity #Gemini #SoftwareEngineering #BlackstarCodelabs`;

  const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postTemplate)}`;
  window.open(shareUrl, "_blank");
};
