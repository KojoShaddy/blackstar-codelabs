// Codelab Content Configuration for Blackstar Codelabs
window.CODELABS_DATA = [
  {
    "id": "building-intelligent-ai-agents-with-antigravity-ide-and-google-agent-development-kit-adk",
    "title": "Building Intelligent AI Agents with Antigravity IDE and Google Agent Development Kit (ADK)",
    "author": "Blackstar Codelabs Team",
    "category": "Google Cloud AI",
    "description": "Learn how to build, run, and interact with AI agents using the Google ADK Python framework in Antigravity IDE.",
    "icon": "🛠️",
    "completionTitle": "Google ADK Codelab Completed!",
    "completionMessage": "Congratulations! You have completed the Google Agent Development Kit (ADK) tutorial and successfully run your agent.",
    "steps": [
      {
        "id": 1,
        "title": "Introduction",
        "duration": 5,
        "contentHtml": "\n          <p>Welcome to the <strong>Google Agent Development Kit (ADK) Codelab</strong>! In this tutorial, you will learn how to build, run, and interact with AI agents using the Google ADK Python framework.</p>\n          <h2>Prerequisites</h2>\n          <p>To be successful in this codelab, you should have a basic understanding of Python programming and executing local scripts.</p>\n          <h2>What you'll learn</h2>\n          <ul>\n            <li>How to set up a virtual environment and install the google-adk package.</li>\n            <li>How to scaffold a new agent using the ADK CLI.</li>\n            <li>How to configure API credentials and customize agent instructions.</li>\n            <li>How to run and interact with your agent via terminal CLI or web UI.</li>\n          </ul>\n          <h2>What you'll need</h2>\n          <ul>\n            <li>Antigravity IDE installed and signed in with Google account</li>\n            <li>A web browser such as Chrome</li>\n          </ul>\n        "
      },
      {
        "id": 2,
        "title": "Introduction to Google ADK",
        "duration": 5,
        "contentHtml": "\n          <p>The <strong>Google Agent Development Kit (ADK)</strong> is an open-source, code-first Python framework designed for building, testing, and deploying reliable AI agents at scale.</p>\n          <h2>Key advantages of ADK:</h2>\n          <ul>\n            <li><strong>Simplicity:</strong> Easily define agent instructions, tools, and models in Python.</li>\n            <li><strong>Interoperability:</strong> Seamlessly switch between Google AI (Gemini Developer API) and Vertex AI backends.</li>\n            <li><strong>Built-in tools:</strong> Ships with a built-in interactive CLI runner and a FastAPI web UI.</li>\n          </ul>\n        "
      },
      {
        "id": 3,
        "title": "Prerequisites & Environment Setup",
        "duration": 10,
        "contentHtml": "\n          <p>ADK requires <strong>Python 3.10+</strong>. Follow these steps to prepare your workspace and directory structure:</p>\n          <h2>Step A: Workspace Setup in Antigravity IDE</h2>\n          <ol>\n            <li>Open the <strong>Antigravity IDE</strong>.</li>\n            <li>Click on <strong>File</strong> &gt; <strong>Open Folder</strong> (or click <strong>Open Folder</strong> on the welcome screen).</li>\n            <li>Create a new directory named <code>Agent</code> on your local system (e.g., on your Desktop) and select it to open the workspace.</li>\n            <li>Open the integrated terminal in the IDE (go to <strong>Terminal</strong> &gt; <strong>New Terminal</strong> or press <code>Ctrl + `</code>).</li>\n          </ol>\n          <h2>Step B: Initialize a Virtual Environment</h2>\n          <p>Using a virtual environment prevents package name collisions (like the common mistake of installing <code>adk</code> instead of <code>google-adk</code>).</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">bash</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code># Create the virtual environment\npython -m venv .venv\n\n# Activate the virtual environment\n# On Windows (Command Prompt):\n.venv\\Scripts\\activate.bat\n\n# On Windows (PowerShell):\n.\\.venv\\Scripts\\Activate.ps1\n\n# On macOS/Linux:\nsource .venv/bin/activate</code></pre>\n          <h2>Step C: Install the Correct SDK Package</h2>\n          <p>Run the following command to download and install the official Agent Development Kit package:</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">bash</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code>pip install google-adk</code></pre>\n          <div class=\"alert alert-warning\">\n            <span class=\"alert-icon\">⚠️</span>\n            <div class=\"alert-content\">\n              <strong>Warning:</strong> Do NOT run <code>pip install adk</code>. This installs an unrelated RPC development library that conflicts with the Google ADK commands.\n            </div>\n          </div>\n        "
      },
      {
        "id": 4,
        "title": "Scaffolding a New Agent",
        "duration": 5,
        "contentHtml": "\n          <p>To automatically generate the boilerplate files for your agent, run:</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">bash</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code>adk create my_agent</code></pre>\n          <p>During this command, the CLI prompts you:</p>\n          <ol>\n            <li><strong>Choose a model</strong>: Select <code>1</code> for <code>gemini-3.5-flash</code>.</li>\n            <li><strong>Choose a backend</strong>: Select <code>1</code> for <code>Google AI</code>.</li>\n            <li><strong>Google API Key</strong>: Enter your key (or enter a placeholder and modify it later).</li>\n          </ol>\n          <div class=\"alert alert-info\">\n            <span class=\"alert-icon\">💡</span>\n            <div class=\"alert-content\">\n              <strong>Note:</strong> On Windows, if the command crashes at the very end with a <code>UnicodeEncodeError</code>, don't worry. This is a display formatting bug caused by console emojis. The files are still successfully created under the <code>my_agent</code> folder.\n            </div>\n          </div>\n        "
      },
      {
        "id": 5,
        "title": "Exploring the Agent Structure",
        "duration": 5,
        "contentHtml": "\n          <p>Navigate to your newly created directory to find the following files:</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">text</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code>my_agent/\n├── .env          # Stores credentials and API configuration\n├── .gitignore    # Prevents sensitive credentials (.env) from being committed\n├── __init__.py   # Marks the directory as a Python package\n└── agent.py      # Main file defining the agent logic</code></pre>\n          <h2>The Agent Definition (<code>agent.py</code>)</h2>\n          <p>Open <code>my_agent/agent.py</code>. By default, it initializes a basic agent:</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">python</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code>from google.adk.agents.llm_agent import Agent\n\nroot_agent = Agent(\n    model='gemini-3.5-flash',\n    name='root_agent',\n    description='A helpful assistant for user questions.',\n    instruction='Answer user questions to the best of your knowledge',\n)</code></pre>\n        "
      },
      {
        "id": 6,
        "title": "Configuring API Credentials",
        "duration": 5,
        "contentHtml": "\n          <p>Open <code>my_agent/.env</code>. It should look like this:</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">ini</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code>GOOGLE_GENAI_USE_ENTERPRISE=0\nGOOGLE_API_KEY=YOUR_GEMINI_API_KEY</code></pre>\n          <p>Replace <code>YOUR_GEMINI_API_KEY</code> with a valid Gemini API key from <a href=\"https://aistudio.google.com/apikey\" target=\"_blank\">Google AI Studio</a>.</p>\n        "
      },
      {
        "id": 7,
        "title": "Running Your Agent",
        "duration": 10,
        "contentHtml": "\n          <p>Make sure your virtual environment is active, and then choose one of the options below to interact with your agent.</p>\n          <h2>Method A: Terminal CLI</h2>\n          <p>You can test your agent directly in the console using:</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">bash</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code># Set console encoding to UTF-8 on Windows to avoid emoji errors\nexport PYTHONIOENCODING=\"utf-8\"\n\n# Run in interactive CLI mode\nadk run my_agent</code></pre>\n          <p>You will see an interactive prompt where you can chat directly with your agent.</p>\n          <h2>Method B: Interactive Web UI</h2>\n          <p>ADK has a built-in FastAPI web server that provides a clean chat UI.</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">bash</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code># Start the web UI server\nadk web my_agent</code></pre>\n          <ul>\n            <li>By default, the server runs on <code>http://127.0.0.1:8000</code>.</li>\n            <li>Open your browser, navigate to the URL, and start chatting with the agent!</li>\n          </ul>\n        "
      },
      {
        "id": 8,
        "title": "Enhancing the Agent (Adding Custom Logic)",
        "duration": 10,
        "contentHtml": "\n          <p>You can modify the agent's instructions or logic. For instance, to give the agent awareness of time, import the <code>datetime</code> library and append a rule to its instructions.</p>\n          <p>Modify <code>my_agent/agent.py</code> to match the following:</p>\n          <pre><div class=\"code-header\"><span class=\"code-lang\">python</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code>from datetime import datetime\nfrom google.adk.agents.llm_agent import Agent\n\n# Get current system time to inject\ncurrent_time = datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")\n\nroot_agent = Agent(\n    model='gemini-3.5-flash',\n    name='root_agent',\n    description='A helpful assistant for user questions.',\n    instruction=f'Answer user questions to the best of your knowledge. The current time is {current_time}. Always keep answers concise.',\n)</code></pre>\n          <p>Restart the agent (<code>adk run my_agent</code> or <code>adk web my_agent</code>) and ask: <em>\"What time is it?\"</em> to confirm it utilizes your custom time injection.</p>\n        "
      },
      {
        "id": 9,
        "title": "Conclusion & Next Steps",
        "duration": 5,
        "contentHtml": "\n          <h2>Review Summary</h2>\n          <p>Congratulations! You have successfully configured and run your first Google ADK agent.</p>\n          <p>To continue building:</p>\n          <ol>\n            <li><strong>Add Tools:</strong> Integrate functions for the agent to call by using python functions.</li>\n            <li><strong>Multi-Agent Systems:</strong> Connect multiple agents together by adding sub-agents.</li>\n            <li><strong>Deploy:</strong> Package your agent to run in production using <code>Google Cloud Run</code>, <code>Google App Engine</code>, <code>Google Kubernetes Engine</code>, or <code>Google Compute Engine</code>.</li>\n          </ol>\n          <p>Refer to the official documentation on the <a href=\"https://github.com/KojoShaddy/my_agent\" target=\"_blank\">Google ADK GitHub Repository</a> for more advanced tutorials.</p>\n        "
      }
    ]
  },
  {
    "id": "ai-generated-codelab",
    "title": "AI Generated Codelab",
    "author": "Blackstar Local Compiler Agent",
    "category": "Google Cloud AI",
    "description": "A tutorial structured by the Local AI Agent parser.",
    "icon": "⚡",
    "completionTitle": "AI Generated Codelab Completed!",
    "completionMessage": "Congratulations! You have completed this step-by-step tutorial published via the Local Compiler Agent.",
    "steps": [
      {
        "id": 1,
        "title": "Introduction",
        "duration": 5,
        "contentHtml": "\n        <p>Welcome to the <strong>AI Generated Codelab</strong>! In this tutorial, you will explore a step-by-step tutorial structured by the Local AI Agent parser.</p>\n        <h2>Prerequisites</h2>\n        <p>To be successful in this codelab, you should have a basic understanding of software development workflows and executing local server processes.</p>\n        <h2>What you'll learn</h2>\n        <ul>\n          <li>How to review generated step contents for accuracy</li>\n          <li>How to insert Gemini API Keys for advanced formatting</li>\n          <li>How to configure local sandbox environments</li>\n        </ul>\n        <h2>What you'll need</h2>\n        <ul>\n          <li>A Google Cloud Account and Google Cloud Project</li>\n          <li>A web browser such as Chrome</li>\n        </ul>\n      "
      },
      {
        "id": 2,
        "title": "Generated Tutorial Overview",
        "duration": 5,
        "contentHtml": "\n        <p>I parsed your submitted prompt and generated this overview. You requested content about: <em>\" User Prompt: Create a step-by-step tutorial on Vertex AI Pipelines ...\"</em></p>\n        <div class=\"alert alert-info\">\n          <span class=\"alert-icon\">💡</span>\n          <div class=\"alert-content\">\n            <strong>System Advice:</strong> To parse structures automatically with headings and steps, organize your input text using Markdown headers like <code>## Step Title</code> and list items like <code>- [ ] Task checkbox</code>.\n          </div>\n        </div>\n        <h2>Proposed Checklist Tasks</h2>\n        <ul>\n          <li style=\"list-style: none;\"><label class=\"checklist-item\"><input type=\"checkbox\" class=\"checklist-checkbox\" data-checklist-id=\"ai-generated-codelab-setup-run\"><span class=\"checklist-text\">Review generated step contents</span></label></li>\n          <li style=\"list-style: none;\"><label class=\"checklist-item\"><input type=\"checkbox\" class=\"checklist-checkbox\" data-checklist-id=\"ai-generated-codelab-key-run\"><span class=\"checklist-text\">Insert Gemini API Key in the settings panel for advanced formatting</span></label></li>\n        </ul>\n      "
      },
      {
        "id": 3,
        "title": "Step 2: Command Configuration",
        "duration": 10,
        "contentHtml": "\n        <p>This is a secondary step generated from your prompt. Execute this command in your sandbox workspace:</p>\n        <pre><div class=\"code-header\"><span class=\"code-lang\">bash</span><button class=\"btn-copy\" onclick=\"copyCode(this)\">Copy</button></div><code>npm run start</code></pre>\n        <p>Once started, navigate to your web dashboard to see changes live!</p>\n      "
      }
    ]
  },
  {
    id: "orchestrating-parallel-agents",
    title: "Orchestrating Parallel Agents with Antigravity 2.0 and Gemini 3.5 Flash",
    author: "Blackstar Codelabs Team",
    category: "Agent Orchestration",
    description: "Learn how to coordinate multiple AI agents, automate recurring tasks, and build autonomous workflows using Antigravity 2.0 and Gemini 3.5 Flash.",
    icon: "🤖",
    completionTitle: "Agent Orchestration Completed!",
    completionMessage: "Congratulations! You have successfully configured and executed autonomous agent workflows using Antigravity 2.0 and Gemini 3.5 Flash with Blackstar Codelabs.",
    steps: [
      {
        id: 1,
        title: "Introduction",
        duration: 5,
        contentHtml: `
          <p>Welcome to <strong>Orchestrating Parallel Agents with Antigravity 2.0 and Gemini 3.5 Flash</strong>! Modern software development is moving beyond AI-assisted coding toward AI-orchestrated workflows. Antigravity 2.0 introduces Projects, Git Worktree support, Scheduled Tasks, JSON Hooks, and enhanced security controls that enable developers to manage complex workflows with multiple agents working in parallel.</p>
          <h2>Prerequisites</h2>
          <p>To successfully complete this codelab, you should have basic experience with terminal commands, Git, and using AI agents for development tasks.</p>
          <h2>What you'll learn</h2>
          <ul>
            <li>Create and configure a Project in Antigravity 2.0</li>
            <li>Use Gemini 3.5 Flash to coordinate multiple tasks</li>
            <li>Leverage Git Worktrees for isolated agent execution</li>
            <li>Configure Scheduled Tasks for automation</li>
            <li>Create a JSON Hook to customize agent behavior</li>
            <li>Understand scoped permissions and security settings</li>
          </ul>
          <h2>What you'll need</h2>
          <ul>
            <li>Antigravity 2.0 installed and signed in with Google account</li>
            <li>A web browser such as Chrome</li>
          </ul>
        `
      },
      {
        id: 2,
        title: "Overview & Key Concepts",
        duration: 5,
        contentHtml: `
          <p>Welcome to <strong>Blackstar Codelabs</strong>! In this hands-on lab, you will learn how to use Antigravity 2.0 to coordinate multiple AI agents, automate recurring tasks, and build autonomous workflows using Gemini 3.5 Flash.</p>
          
          <h2>Overview</h2>
          <p>Modern software development is moving beyond AI-assisted coding toward AI-orchestrated workflows. Antigravity 2.0 introduces Projects, Git Worktree support, Scheduled Tasks, JSON Hooks, and enhanced security controls that enable developers to manage complex workflows with multiple agents working in parallel.</p>
          <p>In this lab, you will create a project, configure an autonomous workflow, schedule recurring tasks, and explore how Antigravity 2.0 can automate routine engineering activities.</p>

          <div class="alert alert-info">
            <span class="alert-icon">💡</span>
            <div class="alert-content">
              <strong>Key Concept:</strong> Scoped permissions in Antigravity 2.0 ensure that agents can only interact with authorized directories, keeping your system safe while letting them automate development pipelines.
            </div>
          </div>

          <h2>What You Will Learn</h2>
          <ul>
            <li>Create and configure a Project in Antigravity 2.0</li>
            <li>Use Gemini 3.5 Flash to coordinate multiple tasks</li>
            <li>Leverage Git Worktrees for isolated agent execution</li>
            <li>Configure Scheduled Tasks for automation</li>
            <li>Create a JSON Hook to customize agent behavior</li>
            <li>Understand scoped permissions and security settings</li>
          </ul>
        `
      },
      {
        id: 3,
        title: "Create a New Project",
        duration: 10,
        contentHtml: `
          <p>Projects are the foundation of Antigravity 2.0. Unlike previous versions where agents were tied to a single workspace, Projects allow agents to work across multiple folders while maintaining isolated settings and permissions.</p>
          
          <h2>Instructions</h2>
          <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Open the Antigravity 2.0 interface.</li>
            <li>Click on <strong>File</strong> and then <strong>Create Project</strong>.</li>
            <li>Name the project folder precisely:</li>
          </ol>

          <pre><div class="code-header"><span class="code-lang">Project Name</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>DataOps-Automation</code></pre>

          <ol start="4" style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Select a local directory folder to act as your project workspace.</li>
            <li>Keep the default security settings preset selected.</li>
            <li>Click <strong>Create Project</strong>.</li>
          </ol>

          <div class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div class="alert-content">
              <strong>Verify:</strong> You should now see your newly created project <code>DataOps-Automation</code> listed in the sidebar navigation panel.
            </div>
          </div>
        `
      },
      {
        id: 4,
        title: "Explore Project Configuration",
        duration: 5,
        contentHtml: `
          <p>Antigravity 2.0 allows each project to have its own settings, permissions, and security controls.</p>
          
          <h2>Instructions</h2>
          <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Open the project settings by clicking the gear icon next to your project title.</li>
            <li>Locate the <strong>Security Settings</strong> section.</li>
            <li>Review the available presets:
          <ul>
            <li><strong>Default:</strong> Requires manual review for all terminal commands and file accesses outside of the working folders.</li>
            <li><strong>Full Machine:</strong> All terminal commands require review. The agent can read or write to any file in the machine.</li>
            <li><strong>Turbo Mode:</strong> Disables all safety barriers for maximal iteration velocity.</li>
            <li><strong>Custom:</strong> Manually customize individual settings.</li>
          </ul>
            </li>
            <li>Leave the project configured with the <strong>Default</strong> preset selected.</li>
          </ol>

          <div class="alert alert-info">
            <span class="alert-icon">🔒</span>
            <div class="alert-content">
              <strong>Discussion:</strong> The Default preset restricts agent access to only the folders assigned to the project, helping protect the rest of your machine while still enabling productive automation.
            </div>
          </div>
        `
      },
      {
        id: 5,
        title: "Create an Autonomous Workflow",
        duration: 10,
        contentHtml: `
          <p>We will use Gemini 3.5 Flash to design a simple data-processing workflow.</p>
          
          <h2>Prompt</h2>
          <p>Enter the following prompt into the agent dialogue input box:</p>

          <pre><div class="code-header"><span class="code-lang">Prompt</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>You are a Data Operations Coordinator.

Design a workflow that:

1. Receives transaction data files.
2. Cleans and validates the records.
3. Detects unusual transactions.
4. Generates a summary report.

Break the workflow into specialized tasks that can be executed independently.</code></pre>

          <h2>Expected Outcome</h2>
          <p>Gemini should propose a structured workflow layout containing separate responsibilities such as:</p>
          <ul>
            <li><strong>Data Validation</strong>: Schema checks and type verifications.</li>
            <li><strong>Data Cleaning</strong>: Null formatting and parsing corrections.</li>
            <li><strong>Anomaly Detection</strong>: Outlier detection and notification hooks.</li>
            <li><strong>Report Generation</strong>: Visual summaries and files creation.</li>
          </ul>
          <p>These independent responsibilities form the logical basis of a multi-agent parallel workflow.</p>
        `
      },
      {
        id: 6,
        title: "Enable Parallel Execution with Worktrees",
        duration: 10,
        contentHtml: `
          <p>One of the major improvements in Antigravity 2.0 is native <strong>Git Worktree</strong> support.</p>
          <p>Git Worktrees allow agents to operate in isolated working directories without interfering with each other's branch structures.</p>
          
          <h2>Instructions</h2>
          <p>Ask the Antigravity agent in your chat panel:</p>

          <pre><div class="code-header"><span class="code-lang">Prompt</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>Create separate implementation plans for:

1. Data validation
2. Data cleaning
3. Anomaly detection
4. Reporting

Assume each task can be developed independently.</code></pre>

          <div class="alert alert-info">
            <span class="alert-icon">⚡</span>
            <div class="alert-content">
              <strong>Discussion:</strong> Instead of a single agent handling every task sequentially, worktrees allow multiple agents to work in isolated environments simultaneously. This approach improves productivity while reducing conflicts between parallel tasks.
            </div>
          </div>
        `
      },
      {
        id: 7,
        title: "Create a Scheduled Task",
        duration: 10,
        contentHtml: `
          <p>Scheduled Tasks allow Antigravity to send instruction prompts to agents automatically, even when you are away from the keyboard.</p>
          
          <h2>Instructions</h2>
          <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Open the <strong>Scheduled Tasks</strong> dashboard utility.</li>
            <li>Click <strong>Create New Task</strong>.</li>
            <li>Configure the following cron interval schedule:</li>
          </ol>

          <pre><div class="code-header"><span class="code-lang">Interval</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>*/15 * * * *</code></pre>

          <ol start="4" style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Use the following prompt content to instruct the agent daemon:</li>
          </ol>

          <pre><div class="code-header"><span class="code-lang">Task Prompt</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>Review the project workspace and generate a status summary of completed, pending, and blocked tasks.</code></pre>

          <ol start="5" style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Save the task configuration.</li>
          </ol>

          <div class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div class="alert-content">
              <strong>Verify:</strong> Your project should now contain a recurring cron task that automatically checks project files progress periodically.
            </div>
          </div>
        `
      },
      {
        id: 8,
        title: "Create a JSON Hook",
        duration: 10,
        contentHtml: `
          <p>JSON Hooks allow custom local scripts to execute during specific stages of the agent runtime lifecycle.</p>
          
          <h2>Instructions</h2>
          <p>Create a hook configuration file named <code>audit-hook.json</code> in your project repository:</p>

          <pre><div class="code-header"><span class="code-lang">json</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>{
  "name": "project_audit",
  "event": "after_model_response",
  "script": "./scripts/audit.sh"
}</code></pre>

          <div class="alert alert-info">
            <span class="alert-icon">⚙️</span>
            <div class="alert-content">
              <strong>Discussion:</strong> This hook executes after each model response. It is commonly used for logging activity, monitoring outputs, triggering local webhooks, or running compliance checks.
            </div>
          </div>
        `
      },
      {
        id: 9,
        title: "Test Voice Interaction",
        duration: 5,
        contentHtml: `
          <p>Antigravity 2.0 includes built-in voice transcription modules to speed up prompt delivery.</p>
          
          <h2>Instructions</h2>
          <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Click the <strong>microphone</strong> icon in the chat controls.</li>
            <li>Clearly speak the following sentence:</li>
          </ol>

          <pre><div class="code-header"><span class="code-lang">Voice Phrase</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>Review the current workflow and suggest two improvements.</code></pre>

          <ol start="3" style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Stop recording when finished speaking.</li>
          </ol>

          <div class="alert alert-info">
            <span class="alert-icon">🎤</span>
            <div class="alert-content">
              <strong>Observe:</strong> Antigravity automatically filters backgound noise, cleans up speech-to-text transcript output, and submits the optimized text directly to the model.
            </div>
          </div>
        `
      },
      {
        id: 10,
        title: "Review & Next Steps",
        duration: 5,
        contentHtml: `
          <h2>Review Summary</h2>
          <p>In this lab, you successfully completed the following activities:</p>
          <ul>
            <li>Created a Project space in Antigravity 2.0</li>
            <li>Reviewed Sandboxing using the Security Preset defaults</li>
            <li>Designed a multi-agent workflow layout using Gemini 3.5 Flash</li>
            <li>Learned Git Worktrees parallel execution concepts</li>
            <li>Configured Scheduled daemon Tasks and JSON lifecycle Hooks</li>
            <li>Tested built-in Audio Voice prompt transcription</li>
          </ul>

          <h2>Next Steps to Explore</h2>
          <ul>
            <li>Connect multiple Git repositories to a single project space.</li>
            <li>Build custom JSON Hooks for triggering team Slack/Discord alerts.</li>
            <li>Test the terminal agent using the <code>/browser</code> command line tool.</li>
            <li>Integrate custom diagnostics utilities via MCP servers.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "getting-started-antigravity",
    title: "Getting Started with Antigravity 2.0",
    author: "Blackstar Codelabs Team",
    category: "Introduction",
    description: "Get up and running with the basics of Antigravity 2.0 and learn about its core concepts.",
    icon: "🚀",
    completionTitle: "Getting Started Completed!",
    completionMessage: "Fantastic! You have completed the basic intro to Antigravity 2.0. You are now ready for advanced orchestration workflows.",
    steps: [
      {
        id: 1,
        title: "Introduction",
        duration: 5,
        contentHtml: `
          <p>Welcome to <strong>Getting Started with Antigravity 2.0</strong>! In this codelab, you will get up and running with the basics of Antigravity 2.0 and learn about its core concepts.</p>
          <h2>Prerequisites</h2>
          <p>No prior experience with Antigravity is required. Basic familiarity with command-line tools is helpful.</p>
          <h2>What you'll learn</h2>
          <ul>
            <li>Understanding the Isolated Agent Sandbox</li>
            <li>Running your first sandboxed command</li>
            <li>Basic configuration of Antigravity workspaces</li>
          </ul>
          <h2>What you'll need</h2>
          <ul>
            <li>Antigravity 2.0 installed and signed in with Google account</li>
            <li>A web browser such as Chrome</li>
          </ul>
        `
      },
      {
        id: 2,
        title: "Overview & Setup",
        duration: 5,
        contentHtml: `
          <p>Welcome to Antigravity 2.0! Antigravity is a premium, powerful agentic AI coding workspace designed to let AI coordinate development processes securely on your machine.</p>
          <h2>Key Features</h2>
          <ul>
            <li><strong>Isolated Agent Sandbox</strong>: Control exactly what directories and commands the agent can access.</li>
            <li><strong>Multi-Agent Coordination</strong>: Spawn parallel subagents to solve complex tasks.</li>
            <li><strong>Git Worktree Support</strong>: Run multiple agents on separate branches in parallel without merge conflicts.</li>
          </ul>
        `
      },
      {
        id: 3,
        title: "Your First Sandbox Command",
        duration: 5,
        contentHtml: `
          <p>In Antigravity 2.0, terminal commands are ran within a sandboxed executor that prompts you for permission before executing dangerous or modifying commands.</p>
          <h2>Run Hello World</h2>
          <p>Instruct your agent to execute the following simple command:</p>
          <pre><div class="code-header"><span class="code-lang">bash</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>echo "Hello from Antigravity Sandbox"</code></pre>
        `
      }
    ]
  },
  {
    id: "building-mcp-servers",
    title: "Building Custom MCP Servers with Gemini 3.5 Flash",
    author: "Blackstar Codelabs Team",
    category: "Integrations",
    description: "Write custom Model Context Protocol (MCP) servers to extend your AI agent's capability with custom APIs and local tools.",
    icon: "🔌",
    completionTitle: "MCP Setup Complete!",
    completionMessage: "Excellent! You have successfully built and verified a custom MCP server, letting Gemini 3.5 Flash query real-time data securely.",
    steps: [
      {
        id: 1,
        title: "Introduction",
        duration: 5,
        contentHtml: `
          <p>Welcome to <strong>Building Custom MCP Servers with Gemini 3.5 Flash</strong>! Write custom Model Context Protocol (MCP) servers to extend your AI agent's capability with custom APIs and local tools.</p>
          <h2>Prerequisites</h2>
          <p>Basic knowledge of JavaScript/Node.js and web service APIs is recommended.</p>
          <h2>What you'll learn</h2>
          <ul>
            <li>The architecture of the Model Context Protocol (MCP)</li>
            <li>How to implement a Node.js MCP server</li>
            <li>How to register custom tools and query real-time data</li>
          </ul>
          <h2>What you'll need</h2>
          <ul>
            <li>Antigravity 2.0 installed and signed in with Google account</li>
            <li>A web browser such as Chrome</li>
          </ul>
        `
      },
      {
        id: 2,
        title: "Understanding MCP",
        duration: 10,
        contentHtml: `
          <p>The Model Context Protocol (MCP) defines an open standard for how AI applications securely connect to data sources and local developer tools.</p>
          <div class="alert alert-info">
            <span class="alert-icon">💡</span>
            <div class="alert-content">
              <strong>Concept:</strong> MCP is designed like a web server for LLM tools. Instead of baking APIs directly into the agent, the agent queries the MCP server to discover what tools are available and how to call them.
            </div>
          </div>
        `
      },
      {
        id: 3,
        title: "Implementing a Node.js Server",
        duration: 10,
        contentHtml: `
          <p>Let's create a minimal MCP server in Javascript that registers a custom tool called <code>fetch_weather</code>.</p>
          <pre><div class="code-header"><span class="code-lang">javascript</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
const server = new McpServer({
  name: "weather-mcp-server",
  version: "1.0.0"
});</code></pre>
        `
      }
    ]
  },
  {
    id: "prompt-driven-multi-agent-course-creator",
    title: "Building a Prompt-Driven Multi-Agent Course Creator in Antigravity 2.0",
    author: "Blackstar Codelabs Team",
    category: "Agent Orchestration",
    description: "Configure a structured, three-tier multi-agent pipeline in Google Antigravity 2.0 to search, judge, and draft course curricula autonomously.",
    icon: "📚",
    completionTitle: "Course Creator Completed!",
    completionMessage: "Congratulations! You have successfully orchestrated a three-tier prompt-driven multi-agent pipeline in Google Antigravity 2.0.",
    steps: [
      {
        id: 1,
        title: "Introduction",
        duration: 5,
        contentHtml: `
          <p>Welcome to <strong>Building a Prompt-Driven Multi-Agent Course Creator in Antigravity 2.0</strong>! Learn how to configure a structured, three-tier multi-agent pipeline in Google Antigravity 2.0 to search, judge, and draft course curricula autonomously.</p>
          <h2>Prerequisites</h2>
          <p>Familiarity with prompt design and multi-agent systems is helpful, but not required.</p>
          <h2>What you'll learn</h2>
          <ul>
            <li>How to configure a three-tier multi-agent pipeline</li>
            <li>How to register Researcher, Judge, and Content Builder agent roles</li>
            <li>How to orchestrate an autonomous research and compilation workflow</li>
          </ul>
          <h2>What you'll need</h2>
          <ul>
            <li>Antigravity 2.0 installed and signed in with Google account</li>
            <li>A web browser such as Chrome</li>
          </ul>
        `
      },
      {
        id: 2,
        title: "Initializing the Core Multi-Agent Shell",
        duration: 10,
        contentHtml: `
          <p>In this codelab, you will configure a structured, three-tier multi-agent pipeline in Google Antigravity 2.0. The system will build your agent roles and communication guardrails first, pause to accept your chosen topic, and then orchestrate a research, critique, and drafting sequence entirely via natural language prompts.</p>
          
          <h2>Instructions</h2>
          <p>To prevent the agents from running on a blank or default topic, you must first instruct the Antigravity master agent to provision the specialized workspace, assign tool access, and wait for human input.</p>

          <h3>The Agent Configuration Prompt</h3>
          <p>Copy and enter this prompt into your Antigravity 2.0 chat interface:</p>
          <pre><div class="code-header"><span class="code-lang">Prompt</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>/goal Initialize a sequential multi-agent workspace with three specialized sub-agents. 

Do not start researching or writing files yet. First, configure and register the following agent roles:
1. Researcher Agent: Equipped with the \`/browser\` capability to find up-to-date information, extract core facts, and save raw intelligence to \`workspace/raw_research.json\`.
2. Judge Agent: Assigned to read \`workspace/raw_research.json\`, critique the findings for factual gaps, quality, and completeness, and log a validation report to \`workspace/critique.json\`.
3. Content Builder Agent: Assigned to take the validated research and the Judge's feedback, resolve any highlighted gaps, and structure the entire output into a beautifully formatted Markdown course curriculum saved as \`workspace/course_curriculum.md\`.

Once this environment shell is fully established and all three agent states are registered, halt execution completely. 

Then, present this exact message in the chat panel:
"🤖 The Researcher, Judge, and Content Builder agents are fully provisioned and standing by. What topic would you like to build a course for today?"</code></pre>
        `
      },
      {
        id: 3,
        title: "Triggering the Agents with Your Topic",
        duration: 5,
        contentHtml: `
          <p>Once the master agent confirms that your three sub-agents are ready, the system pauses for your input.</p>

          <h2>Instructions</h2>
          <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Wait for the agent to display the confirmation prompt.</li>
            <li>Type your target topic into the prompt bar. For example:</li>
          </ol>

          <pre><div class="code-header"><span class="code-lang">Topic Prompt</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>The technical architecture of Quantum Computing simulators and their application in cryptography by 2026.</code></pre>

          <ol start="3" style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
            <li>Press Enter. The master orchestrator will feed this topic into the Researcher Agent to kick off the autonomous pipeline.</li>
          </ol>
        `
      },
      {
        id: 4,
        title: "Verifying the Multi-Agent Pipeline & Files",
        duration: 10,
        contentHtml: `
          <p>As the agents process your topic, you can verify their collaborative lifecycle in real time through two views:</p>

          <h2>A. The Live Stream Tracing</h2>
          <p>Watch the chat panel output to confirm that control moves sequentially through your three agents without skipping steps:</p>
          <ul>
            <li><code>[Researcher Agent]</code> Initializing web search queries for topic...</li>
            <li><code>[System Hand-off]</code> Raw data saved. Routing payload to Judge Agent.</li>
            <li><code>[Judge Agent]</code> Evaluating research quality... Warning: Missing 2026 algorithmic standards. Appending to critique log.</li>
            <li><code>[System Hand-off]</code> Critique complete. Routing all logs to Content Builder Agent.</li>
            <li><code>[Content Builder Agent]</code> Synthesizing data, patching missing items, and compilation started...</li>
          </ul>

          <h2>B. Directory Tree Inspection</h2>
          <p>Open the integrated file explorer sidebar in your Antigravity workspace to watch the files update live as each agent checks off its task:</p>
        `
      },
      {
        id: 5,
        title: "Launching the Course Preview UI",
        duration: 5,
        contentHtml: `
          <p>To review the finalized course curriculum generated by the system without opening a separate markdown reader, you can use Antigravity's internal rendering engine.</p>

          <h2>Instructions</h2>
          <p>Type this final command into the prompt bar:</p>
          <pre><div class="code-header"><span class="code-lang">command</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>Launch the web preview panel for workspace/course_curriculum.md</code></pre>

          <p>A polished Preview Window will slide out on the right side of the desktop app, allowing you to read through the structured course, check the formatting, and verify how well the Content Builder integrated the Judge's critiques into the final lesson modules.</p>
        `
      }
    ]
  }
];
