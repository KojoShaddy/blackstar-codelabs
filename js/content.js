// Codelab Content Configuration for Blackstar Codelabs
window.CODELABS_DATA = [
  {
    id: "orchestrating-parallel-agents",
    title: "Orchestrating Parallel Agents with Antigravity 2.0 and Gemini 3.5 Flash",
    author: "Blackstar Codelabs Team",
    category: "Agent Orchestration",
    description: "Learn how to coordinate multiple AI agents, automate recurring tasks, and build autonomous workflows using Antigravity 2.0 and Gemini 3.5 Flash.",
    icon: "🤖",
    steps: [
      {
        id: 1,
        title: "Introduction & Overview",
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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
        id: 8,
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
        id: 9,
        title: "Review & Next Steps",
        duration: 5,
        contentHtml: `
          <div class="celebration-view">
            <div class="celebration-icon">🎉🚀</div>
            <h1 class="celebration-title">Codelab Completed!</h1>
            <p class="celebration-text">Congratulations! You have successfully configured and executed autonomous agent workflows using Antigravity 2.0 and Gemini 3.5 Flash with Blackstar Codelabs.</p>
            <button class="btn-share" onclick="shareCodelabCompletion()">Share on LinkedIn</button>
          </div>

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
    steps: [
      {
        id: 1,
        title: "Introduction & Setup",
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
        id: 2,
        title: "Your First Sandbox Command",
        duration: 5,
        contentHtml: `
          <p>In Antigravity 2.0, terminal commands are ran within a sandboxed executor that prompts you for permission before executing dangerous or modifying commands.</p>
          <h2>Run Hello World</h2>
          <p>Instruct your agent to execute the following simple command:</p>
          <pre><div class="code-header"><span class="code-lang">bash</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>echo "Hello from Antigravity Sandbox"</code></pre>
        `
      },
      {
        id: 3,
        title: "Codelab Complete!",
        duration: 5,
        contentHtml: `
          <div class="celebration-view">
            <div class="celebration-icon">🎉🚀</div>
            <h1 class="celebration-title">Completed!</h1>
            <p class="celebration-text">Fantastic! You have completed the basic intro to Antigravity 2.0. You are now ready for advanced orchestration workflows.</p>
            <button class="btn-share" onclick="shareCodelabCompletion()">Share on LinkedIn</button>
          </div>
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
    steps: [
      {
        id: 1,
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
        id: 2,
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
      },
      {
        id: 3,
        title: "Verify & Connect",
        duration: 5,
        contentHtml: `
          <div class="celebration-view">
            <div class="celebration-icon">🎉🔌</div>
            <h1 class="celebration-title">MCP Setup Complete!</h1>
            <p class="celebration-text">Excellent! You have successfully built and verified a custom MCP server, letting Gemini 3.5 Flash query real-time data securely.</p>
            <button class="btn-share" onclick="shareCodelabCompletion()">Share on LinkedIn</button>
          </div>
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
    steps: [
      {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
        title: "Launching the Course Preview UI",
        duration: 5,
        contentHtml: `
          <p>To review the finalized course curriculum generated by the system without opening a separate markdown reader, you can use Antigravity's internal rendering engine.</p>

          <h2>Instructions</h2>
          <p>Type this final command into the prompt bar:</p>
          <pre><div class="code-header"><span class="code-lang">command</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>Launch the web preview panel for workspace/course_curriculum.md</code></pre>

          <p>A polished Preview Window will slide out on the right side of the desktop app, allowing you to read through the structured course, check the formatting, and verify how well the Content Builder integrated the Judge's critiques into the final lesson modules.</p>

          <div class="celebration-view">
            <div class="celebration-icon">🎉📚</div>
            <h1 class="celebration-title">Course Creator Completed!</h1>
            <p class="celebration-text">Congratulations! You have successfully orchestrated a three-tier prompt-driven multi-agent pipeline in Google Antigravity 2.0.</p>
            <button class="btn-share" onclick="shareCodelabCompletion()">Share on LinkedIn</button>
          </div>
        `
      }
    ]
  }
];
