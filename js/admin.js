// AI Codelab Publisher Admin Script - Blackstar Codelabs

let activeFile = null;
let currentCodelab = null;
let isProcessing = false;

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initAdmin();
});

function initAdmin() {
  const adminView = document.getElementById("admin-view");
  if (!adminView) return; // Prevent errors if on different pages or elements aren't loaded

  // Load API Key
  const apiKeyInput = document.getElementById("gemini-api-key");
  const savedKey = localStorage.getItem("gemini_api_key") || "";
  if (apiKeyInput) {
    apiKeyInput.value = savedKey;
  }

  setupAdminEventListeners();
}

function setupAdminEventListeners() {
  // Settings Drawer Toggle
  const settingsToggle = document.getElementById("admin-settings-toggle");
  const settingsDrawer = document.getElementById("api-settings-drawer");
  if (settingsToggle && settingsDrawer) {
    settingsToggle.addEventListener("click", (e) => {
      e.preventDefault();
      settingsDrawer.classList.toggle("hidden");
    });
  }

  // Save API Key
  const saveKeyBtn = document.getElementById("btn-save-key");
  const apiKeyInput = document.getElementById("gemini-api-key");
  if (saveKeyBtn && apiKeyInput) {
    saveKeyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const keyVal = apiKeyInput.value.trim();
      localStorage.setItem("gemini_api_key", keyVal);
      showNotification("Gemini API key saved locally!");
      document.getElementById("api-settings-drawer").classList.add("hidden");
    });
  }

  // File Upload Drag & Drop Zone
  const uploadZone = document.getElementById("admin-upload-zone");
  const fileInput = document.getElementById("admin-file-input");
  
  if (uploadZone && fileInput) {
    // Click zone triggers file dialog
    uploadZone.addEventListener("click", (e) => {
      if (e.target.id === "btn-remove-file" || e.target.closest("#admin-file-badge")) {
        return; // Don't trigger if removing file
      }
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });

    // Drag-drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadZone.classList.add("dragover");
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadZone.classList.remove("dragover");
      }, false);
    });

    uploadZone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleFileSelection(files[0]);
      }
    });
  }

  // Remove uploaded file
  const removeFileBtn = document.getElementById("btn-remove-file");
  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearUploadedFile();
    });
  }

  // Chat Submission Form
  const chatForm = document.getElementById("admin-chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleChatSubmit();
    });

    // Handle shift+enter in textarea
    const textarea = document.getElementById("admin-chat-input");
    if (textarea) {
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          chatForm.requestSubmit();
        }
      });
    }
  }

  // Workspace Tabs Selector
  const tabButtons = document.querySelectorAll(".w-tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      // Update button highlights
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Update panel visibility
      const tabContents = document.querySelectorAll(".workspace-tab-content");
      tabContents.forEach(content => {
        content.classList.remove("active");
        if (content.id === `w-tab-${targetTab}`) {
          content.classList.add("active");
        }
      });
    });
  });

  // Publish Codelab Button Trigger
  const publishBtn = document.getElementById("btn-publish-codelab");
  if (publishBtn) {
    publishBtn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerCodelabPublishing();
    });
  }
}

// File Ingestion Logic
function handleFileSelection(file) {
  const allowedExtensions = /(\.md|\.txt|\.json)$/i;
  if (!allowedExtensions.exec(file.name)) {
    showNotification("Invalid file type. Please upload a .md, .txt or .json file.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    activeFile = {
      name: file.name,
      size: file.size,
      content: e.target.result
    };

    // Update Dropzone visual display
    const fileBadge = document.getElementById("admin-file-badge");
    const fileNameSpan = fileBadge?.querySelector(".file-name");
    const dropIcon = document.querySelector("#admin-upload-zone .drop-icon");
    const dropText = document.querySelector("#admin-upload-zone .drop-text");

    if (fileBadge && fileNameSpan) {
      fileNameSpan.textContent = `${file.name} (${formatBytes(file.size)})`;
      fileBadge.classList.remove("hidden");
    }

    if (dropIcon) dropIcon.classList.add("hidden");
    if (dropText) dropText.classList.add("hidden");

    showNotification(`Loaded file: ${file.name}`);
  };

  reader.onerror = function() {
    showNotification("Error reading uploaded file.", "error");
  };

  reader.readAsText(file);
}

function clearUploadedFile() {
  activeFile = null;
  const fileInput = document.getElementById("admin-file-input");
  if (fileInput) fileInput.value = "";

  const fileBadge = document.getElementById("admin-file-badge");
  const dropIcon = document.querySelector("#admin-upload-zone .drop-icon");
  const dropText = document.querySelector("#admin-upload-zone .drop-text");

  if (fileBadge) fileBadge.classList.add("hidden");
  if (dropIcon) dropIcon.classList.remove("hidden");
  if (dropText) dropText.classList.remove("hidden");
}

// Ingestion chat submit handler
function handleChatSubmit() {
  if (isProcessing) return;

  const chatInput = document.getElementById("admin-chat-input");
  const prompt = chatInput.value.trim();

  if (!prompt && !activeFile) {
    showNotification("Please upload a file or type message instructions.", "warning");
    return;
  }

  isProcessing = true;
  chatInput.disabled = true;
  document.getElementById("btn-send-message").disabled = true;

  // Append user message
  const fileLabel = activeFile ? `<div class="attached-file-badge"><span class="material-symbols-outlined icon-inline" style="font-size: 1rem; vertical-align: middle; margin-right: 4px;">draft</span> ${activeFile.name}</div>` : '';
  appendChatMessage("user", `
    <p>${escapeHTML(prompt) || 'Processing uploaded document...'}</p>
    ${fileLabel}
  `);

  // Clear prompt
  chatInput.value = "";
  chatInput.style.height = "auto";

  // Append thinking indicator message
  const loadingMsgId = appendChatMessage("agent", `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <span class="processing-text">AI Agent is compiling codelab steps...</span>
  `);

  // Build API payload
  const savedKey = localStorage.getItem("gemini_api_key") || "";
  const payload = {
    prompt: prompt,
    fileContent: activeFile ? activeFile.content : null,
    fileName: activeFile ? activeFile.name : null,
    apiKey: savedKey
  };

  // POST query to Server
  fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    removeChatMessage(loadingMsgId);

    if (data.error) {
      appendChatMessage("agent", `
        <p class="error-text"><strong>Error Processing Payload:</strong> ${escapeHTML(data.error)}</p>
        <p class="settings-hint">Tip: If you're using a Gemini Key, verify it is correct and not rate limited.</p>
      `);
      isProcessing = false;
      chatInput.disabled = false;
      document.getElementById("btn-send-message").disabled = false;
      return;
    }

    // Success response
    currentCodelab = data.data;
    
    appendChatMessage("agent", `
      <p><span class="material-symbols-outlined icon-inline" style="font-size: 1.1rem; vertical-align: middle; margin-right: 4px; color: #fbbf24;">auto_awesome</span> Codelab successfully parsed via <strong>${data.method}</strong>!</p>
      <p>I have structured <strong>${currentCodelab.steps.length} steps</strong>. Please review the <strong>Visual Preview</strong> workspace pane and click the publish button when ready.</p>
    `);

    // Update workspace UI
    populateWorkspacePreview(currentCodelab);

    // Enable Publish CTA button
    const publishBtn = document.getElementById("btn-publish-codelab");
    if (publishBtn) {
      publishBtn.disabled = false;
    }
  })
  .catch(err => {
    console.error(err);
    removeChatMessage(loadingMsgId);
    appendChatMessage("agent", `
      <p class="error-text"><strong>Network Connection Error:</strong> Could not connect to backend server. Make sure node processes are active.</p>
    `);
  })
  .finally(() => {
    isProcessing = false;
    chatInput.disabled = false;
    document.getElementById("btn-send-message").disabled = false;
    clearUploadedFile();
  });
}

// Visual Preview Panel Rendering
function populateWorkspacePreview(codelab) {
  const emptyState = document.getElementById("workspace-preview-empty");
  const loadedState = document.getElementById("workspace-preview-loaded");
  
  if (emptyState) emptyState.classList.add("hidden");
  if (loadedState) loadedState.classList.remove("hidden");

  // Title, Category, Authors
  document.getElementById("preview-title").textContent = codelab.title;
  document.getElementById("preview-description").textContent = codelab.description;
  
  const categoryBadge = document.getElementById("preview-badge-category");
  if (categoryBadge) {
    categoryBadge.textContent = codelab.category || "General";
  }
  
  const authorBadge = document.getElementById("preview-badge-author");
  if (authorBadge) {
    authorBadge.textContent = `by ${codelab.author || 'AI Publisher'}`;
  }

  // Accordion Steps List
  const stepsAccordion = document.getElementById("preview-steps-accordion");
  if (stepsAccordion) {
    stepsAccordion.innerHTML = "";

    codelab.steps.forEach((step, idx) => {
      const stepItem = document.createElement("div");
      stepItem.className = "accordion-item";
      
      // Step Header
      const header = document.createElement("div");
      header.className = `accordion-header ${idx === 0 ? "active" : ""}`;
      header.innerHTML = `
        <span class="step-num">${step.id}</span>
        <span class="step-title">${escapeHTML(step.title)}</span>
        <span class="step-time"><span class="material-symbols-outlined icon-inline" style="font-size: 1rem; vertical-align: middle; margin-right: 4px;">schedule</span> ${step.duration} mins</span>
        <span class="accordion-arrow">${idx === 0 ? "▼" : "▶"}</span>
      `;

      // Step Body
      const body = document.createElement("div");
      body.className = `accordion-body ${idx === 0 ? "active" : ""}`;
      body.innerHTML = `
        <div class="step-preview-inner">
          ${window.replaceEmojisWithIcons ? window.replaceEmojisWithIcons(step.contentHtml) : step.contentHtml}
        </div>
      `;

      // Accordion click toggle
      header.addEventListener("click", () => {
        const isActive = body.classList.contains("active");
        
        // Toggle active statuses
        header.classList.toggle("active", !isActive);
        body.classList.toggle("active", !isActive);
        header.querySelector(".accordion-arrow").textContent = isActive ? "▶" : "▼";
      });

      stepItem.appendChild(header);
      stepItem.appendChild(body);
      stepsAccordion.appendChild(stepItem);
    });
  }

  // Populate raw JSON tab
  const jsonCodeBlock = document.getElementById("preview-json-code");
  if (jsonCodeBlock) {
    jsonCodeBlock.textContent = JSON.stringify(codelab, null, 2);
  }

  // Switch workspace tab to preview automatically
  const previewTabBtn = document.querySelector(".w-tab-btn[data-tab='preview']");
  if (previewTabBtn) previewTabBtn.click();
}

// Publishing action
function triggerCodelabPublishing() {
  if (!currentCodelab) return;

  const publishBtn = document.getElementById("btn-publish-codelab");
  publishBtn.disabled = true;

  // Switch to logs tab
  const logsTabBtn = document.querySelector(".w-tab-btn[data-tab='logs']");
  if (logsTabBtn) logsTabBtn.click();

  const terminalBody = document.getElementById("publisher-terminal-logs");
  if (terminalBody) {
    terminalBody.innerHTML = "";
  }

  // Logging sequence helper
  const logLines = [
    { text: "🤖 [AGENT] Starting publishing pipeline sequence...", delay: 200, type: "info" },
    { text: "📦 [SYSTEM] Validating codelab configuration structure...", delay: 600, type: "info" },
    { text: `📝 [FILE] Target repository write target: js/content.js`, delay: 1000, type: "info" },
    { text: "🔨 [COMPILER] Compiling step nodes and matching checklist ids...", delay: 1400, type: "info" },
    { text: "🚚 [GIT] Attempting disk injection and file overwrite...", delay: 1800, type: "info" }
  ];

  logLines.forEach(line => {
    setTimeout(() => {
      appendTerminalLog(line.text, line.type);
    }, line.delay);
  });

  // Call server to write code
  setTimeout(() => {
    fetch("/api/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ codelab: currentCodelab })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        appendTerminalLog(`❌ [ERROR] Deployment failed: ${data.error}`, "error");
        publishBtn.disabled = false;
        return;
      }

      // Success
      appendTerminalLog("✅ [SUCCESS] Database write successful! content.js synchronized.", "success");
      appendTerminalLog("🚀 [PIPELINE] Deploy complete. Portal dashboard updated live.", "success");

      // Celebrate
      if (window.triggerConfetti) {
        window.triggerConfetti();
      }

      appendChatMessage("agent", `
        <div class="success-alert-box">
          <h3><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 6px; color: var(--success-color);">celebration</span>Tutorial Published!</h3>
          <p>The codelab <strong>"${currentCodelab.title}"</strong> has been successfully appended to the dataset repository.</p>
          <a href="#home" class="btn-dashboard-redirect" style="display: inline-flex; align-items: center; gap: 6px;"><span class="material-symbols-outlined" style="font-size: 1rem;">dashboard</span> View Dashboard Codelabs</a>
        </div>
      `);
      
      // Auto reload local content dataset list asynchronously
      // (Wait, since it's client-side window memory, let's fetch the content script again!)
      reloadCodelabsContentScript();
    })
    .catch(err => {
      console.error(err);
      appendTerminalLog("❌ [ERROR] Connection lost during repository deployment.", "error");
      publishBtn.disabled = false;
    });
  }, 2400);
}

// Reload window dataset script dynamically so dashboard lists it instantly without force refresh!
function reloadCodelabsContentScript() {
  const existingScript = document.querySelector("script[src='js/content.js']");
  if (existingScript) {
    existingScript.remove();
  }

  const newScript = document.createElement("script");
  newScript.src = `js/content.js?t=${Date.now()}`;
  newScript.onload = () => {
    console.log("Successfully reloaded content.js script dataset!");
  };
  document.body.appendChild(newScript);
}

// Messaging utilities
function appendChatMessage(sender, htmlContent) {
  const chatMessages = document.getElementById("admin-chat-messages");
  if (!chatMessages) return null;

  const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const messageNode = document.createElement("div");
  messageNode.className = `chat-message ${sender}`;
  messageNode.id = msgId;

  const avatar = sender === "agent" 
    ? '<span class="material-symbols-outlined" style="font-size: 1.25rem; vertical-align: middle;">smart_toy</span>' 
    : '<span class="material-symbols-outlined" style="font-size: 1.25rem; vertical-align: middle;">person</span>';
  messageNode.innerHTML = `
    <div class="avatar" style="font-size: 1rem; display: flex; align-items: center; justify-content: center;">${avatar}</div>
    <div class="msg-body">
      ${htmlContent}
    </div>
  `;

  chatMessages.appendChild(messageNode);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return msgId;
}

function removeChatMessage(id) {
  const node = document.getElementById(id);
  if (node) node.remove();
}

function appendTerminalLog(text, type = "info") {
  const terminal = document.getElementById("publisher-terminal-logs");
  if (!terminal) return;

  const logLine = document.createElement("div");
  logLine.className = `log-line ${type}`;
  logLine.textContent = text;
  
  terminal.appendChild(logLine);
  terminal.scrollTop = terminal.scrollHeight;
}

// Notification feedback
function showNotification(text, type = "success") {
  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;
  toast.textContent = text;
  document.body.appendChild(toast);

  // Animate slide-in
  setTimeout(() => {
    toast.classList.add("active");
  }, 10);

  // Slide-out and remove
  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

// Helper utilities
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
