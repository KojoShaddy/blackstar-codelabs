const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME type mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // API Route: AI Chat Parser
  if (req.method === 'POST' && urlPath === '/api/chat') {
    handleChatApi(req, res);
    return;
  }

  // API Route: Publish Codelab
  if (req.method === 'POST' && urlPath === '/api/publish') {
    handlePublishApi(req, res);
    return;
  }

  // Static file handler
  handleStaticFiles(req, res, urlPath);
});

// Static files server function
function handleStaticFiles(req, res, urlPath) {
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);
  
  // Security Check: Make sure files are inside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    
    const stream = fs.createReadStream(filePath);
    stream.on('error', (streamErr) => {
      console.error(streamErr);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    });
    stream.pipe(res);
  });
}

// Handle Gemini API Call or Fallback Local Compiler
function handleChatApi(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const payload = JSON.parse(body);
      const { prompt, fileContent, fileName, apiKey } = payload;

      const combinedText = `
User Prompt: ${prompt || 'Process the uploaded content and generate a Codelab.'}
${fileContent ? `Uploaded File Content (Filename: ${fileName}):\n${fileContent}` : ''}
`;

      if (apiKey && apiKey.trim() !== '') {
        callGeminiApi(apiKey, combinedText, res);
      } else {
        runLocalFallbackParser(combinedText, res);
      }
    } catch (err) {
      console.error('API Error:', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    }
  });
}

// Communicate with Gemini API
function callGeminiApi(apiKey, text, res) {
  const systemInstruction = `You are a professional Codelabs Publishing Agent. Your job is to convert raw texts or markdown files into a structured Google Codelabs JSON file.
You MUST respond with a valid single JSON object and nothing else. No markdown wraps (\`\`\`json ... \`\`\`), no text outside JSON.

JSON Schema structure:
{
  "id": "slugified-title-here",
  "title": "Clean Title of the Codelab",
  "author": "Google Cloud AI Expert",
  "category": "Vertex AI" (or "Agent Orchestration", "Introduction", "Integrations", "BigQuery" etc.),
  "description": "Short 1-2 sentence description explaining the codelab.",
  "icon": "🤖" (or another appropriate single emoji),
  "completionTitle": "Codelab Title Completed!",
  "completionMessage": "A customized success message for completing this specific codelab.",
  "steps": [
    {
      "id": 1,
      "title": "Introduction & Setup",
      "duration": 5,
      "contentHtml": "<p>A detailed paragraph explaining step 1. Use clean HTML nodes only.</p>"
    }
  ]
}

Formatting rules for contentHtml:
1. Translate Markdown headings into <h2> or <h3> tags.
2. Structure list items using <ul> and <li>.
3. Wrap code segments in: <pre><div class="code-header"><span class="code-lang">language</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>your code code here</code></pre>
4. Format checklists with items as: <label class="checklist-item"><input type="checkbox" class="checklist-checkbox" data-checklist-id="unique-step-id-item-index"><span class="checklist-text">Item task details</span></label>
5. Highlight important notices with: <div class="alert alert-info"><span class="alert-icon">💡</span><div class="alert-content"><strong>Note:</strong> detail message here</div></div>
   or <div class="alert alert-success"><span class="alert-icon">✅</span><div class="alert-content"><strong>Verify:</strong> verification text</div></div>
   or <div class="alert alert-warning"><span class="alert-icon">⚠️</span><div class="alert-content"><strong>Warning:</strong> alert text</div></div>

Extract all headers, files, instructions, checklists, and structure them into comprehensive steps. If the input is lacking detail, extrapolate a complete, clear, logical developer tutorial matching the user's requirements. Ensure steps are detailed, educational, and complete.`;

  const requestBody = JSON.stringify({
    contents: [{
      parts: [
        { text: systemInstruction },
        { text: `Raw User Input Content to parse:\n\n${text}` }
      ]
    }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  const apiReq = https.request(options, (apiRes) => {
    let apiData = '';
    apiRes.on('data', d => { apiData += d.toString(); });
    apiRes.on('end', () => {
      try {
        const responseJson = JSON.parse(apiData);
        
        if (responseJson.error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: responseJson.error.message || 'Gemini API Error' }));
          return;
        }

        const candidateText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No output received from Gemini API' }));
          return;
        }

        // Parse candidate text as JSON
        const codelabData = JSON.parse(candidateText.trim());
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, method: 'Gemini AI', data: codelabData }));
      } catch (parseErr) {
        console.error('Parsing Gemini Output Failed. Data:', apiData, parseErr);
        res.writeHead(522, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse Gemini model response as structured JSON', raw: apiData }));
      }
    });
  });

  apiReq.on('error', (e) => {
    console.error('HTTPS Request Error:', e);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Connection to Gemini failed: ${e.message}` }));
  });

  apiReq.write(requestBody);
  apiReq.end();
}

// Regex-based Smart Fallback Parser when API Key is absent
function runLocalFallbackParser(text, res) {
  // Extract Title
  let title = 'AI Generated Codelab';
  const titleMatch = text.match(/(?:title|name|subject|#)\s*:\s*([^\r\n]+)/i) || text.match(/^#\s+([^\r\n]+)/m);
  if (titleMatch) {
    title = titleMatch[1].replace(/^#+\s*/, '').trim();
  }

  // Generate ID
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'local-compiled-lab';

  // Category
  let category = 'Google Cloud AI';
  const categoryMatch = text.match(/(?:category|tags|area)\s*:\s*([^\r\n]+)/i);
  if (categoryMatch) {
    category = categoryMatch[1].trim();
  }

  // Description
  let description = 'A tutorial structured by the Local AI Agent parser.';
  const descMatch = text.match(/(?:description|summary|abstract)\s*:\s*([^\r\n]+)/i);
  if (descMatch) {
    description = descMatch[1].trim();
  }

  // Parse sections as steps
  const steps = [];
  
  // Look for sections: e.g. ## Step X: Name, or ### Name, or Step X: Name
  const stepRegex = /^(?:##|###|Step\s+\d+:?)\s*([^\r\n]+)/gim;
  let match;
  const headings = [];
  const contentIndices = [];
  
  while ((match = stepRegex.exec(text)) !== null) {
    headings.push(match[1].trim());
    contentIndices.push({
      start: match.index + match[0].length,
      end: text.length
    });
  }

  // Update step block boundaries
  for (let i = 0; i < contentIndices.length - 1; i++) {
    contentIndices[i].end = text.indexOf(headings[i + 1], contentIndices[i].start) - 4; // trim buffer
  }

  if (headings.length > 0) {
    headings.forEach((heading, idx) => {
      const startIdx = contentIndices[idx].start;
      const endIdx = contentIndices[idx].end;
      const rawContent = text.slice(startIdx, endIdx).trim();
      
      // Parse basic markdown to simple HTML nodes
      let html = '';
      const lines = rawContent.split(/\r?\n/);
      let inList = false;
      let inCode = false;
      let codeLines = [];
      let codeLang = 'bash';

      lines.forEach((line) => {
        const trimmed = line.trim();
        
        // Code blocks
        if (trimmed.startsWith('```')) {
          if (inCode) {
            inCode = false;
            html += `<pre><div class="code-header"><span class="code-lang">${codeLang}</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>${codeLines.join('\n')}</code></pre>`;
            codeLines = [];
          } else {
            inCode = true;
            codeLang = trimmed.replace('```', '') || 'bash';
          }
          return;
        }

        if (inCode) {
          codeLines.push(line);
          return;
        }

        // Info boxes/quotes
        if (trimmed.startsWith('>')) {
          const content = trimmed.replace(/^>\s*/, '');
          html += `<div class="alert alert-info"><span class="alert-icon">💡</span><div class="alert-content"><strong>Note:</strong> ${content}</div></div>`;
          return;
        }

        // Lists
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          if (!inList) {
            html += '<ul>';
            inList = true;
          }
          // Checklist support
          if (trimmed.includes('[ ]') || trimmed.includes('[]')) {
            const listText = trimmed.replace(/^-\s*\[\s*\]\s*/, '').replace(/^\*\s*\[\s*\]\s*/, '');
            html += `<li style="list-style: none;"><label class="checklist-item"><input type="checkbox" class="checklist-checkbox" data-checklist-id="${id}-step-${idx+1}-chk-${Math.floor(Math.random()*1000)}"><span class="checklist-text">${listText}</span></label></li>`;
          } else {
            const listText = trimmed.replace(/^-\s*/, '').replace(/^\*\s*/, '');
            html += `<li>${listText}</li>`;
          }
          return;
        }

        if (inList && !trimmed.startsWith('-') && !trimmed.startsWith('*') && trimmed !== '') {
          html += '</ul>';
          inList = false;
        }

        if (trimmed === '') {
          return;
        }

        // Paragraphs
        html += `<p>${line.trim()}</p>`;
      });

      if (inList) html += '</ul>';

      steps.push({
        id: idx + 1,
        title: heading,
        duration: 5 + (idx * 5),
        contentHtml: html
      });
    });
  } else {
    // Generates a mock complete codelab if no headers exist
    steps.push({
      id: 1,
      title: "Generated Tutorial Overview",
      duration: 5,
      contentHtml: `
        <p>I parsed your submitted prompt and generated this overview. You requested content about: <em>"${text.slice(0, 100).replace(/[\r\n]+/g, ' ')}..."</em></p>
        <div class="alert alert-info">
          <span class="alert-icon">💡</span>
          <div class="alert-content">
            <strong>System Advice:</strong> To parse structures automatically with headings and steps, organize your input text using Markdown headers like <code>## Step Title</code> and list items like <code>- [ ] Task checkbox</code>.
          </div>
        </div>
        <h2>Proposed Checklist Tasks</h2>
        <ul>
          <li style="list-style: none;"><label class="checklist-item"><input type="checkbox" class="checklist-checkbox" data-checklist-id="${id}-setup-run"><span class="checklist-text">Review generated step contents</span></label></li>
          <li style="list-style: none;"><label class="checklist-item"><input type="checkbox" class="checklist-checkbox" data-checklist-id="${id}-key-run"><span class="checklist-text">Insert Gemini API Key in the settings panel for advanced formatting</span></label></li>
        </ul>
      `
    });
    steps.push({
      id: 2,
      title: "Step 2: Command Configuration",
      duration: 10,
      contentHtml: `
        <p>This is a secondary step generated from your prompt. Execute this command in your sandbox workspace:</p>
        <pre><div class="code-header"><span class="code-lang">bash</span><button class="btn-copy" onclick="copyCode(this)">Copy</button></div><code>npm run start</code></pre>
        <p>Once started, navigate to your web dashboard to see changes live!</p>
      `
    });
  }

  const codelabData = {
    id,
    title,
    author: 'Blackstar Local Compiler Agent',
    category,
    description,
    icon: '⚡',
    completionTitle: `${title} Completed!`,
    completionMessage: 'Congratulations! You have completed this step-by-step tutorial published via the Local Compiler Agent.',
    steps
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, method: 'Local Compiler', data: codelabData }));
}

// Publish endpoint: Inserts codelab object into js/content.js
function handlePublishApi(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const payload = JSON.parse(body);
      const { codelab } = payload;

      if (!codelab || !codelab.id || !codelab.steps) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid codelab data structure' }));
        return;
      }

      const contentFilePath = path.join(PUBLIC_DIR, 'js', 'content.js');

      fs.readFile(contentFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Read Error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Could not read content database file' }));
          return;
        }

        const marker = 'window.CODELABS_DATA = [';
        const markerIdx = data.indexOf(marker);

        if (markerIdx === -1) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Could not locate dataset entry point in content.js' }));
          return;
        }

        // Format the new item and append it
        const insertPos = markerIdx + marker.length;
        
        // Remove existing duplicate with same ID to avoid duplicate keys
        let cleanData = data;
        
        // A simple check to purge a duplicate if it's there
        const duplicateRegex = new RegExp(`\\s*\\{\\s*id:\\s*["']${codelab.id}["'],[\\s\\S]*?\\n\\s*\\},?`, 'g');
        cleanData = cleanData.replace(duplicateRegex, '');

        // Now run insertion
        const refMarkerIdx = cleanData.indexOf(marker);
        const insertIdx = refMarkerIdx + marker.length;
        
        const formattedCodelab = '\n  ' + JSON.stringify(codelab, null, 2).replace(/\n/g, '\n  ') + ',';
        const updatedContent = cleanData.slice(0, insertIdx) + formattedCodelab + cleanData.slice(insertIdx);

        fs.writeFile(contentFilePath, updatedContent, 'utf8', (writeErr) => {
          if (writeErr) {
            console.error('Write Error:', writeErr);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to write updated database back to content.js' }));
            return;
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Codelab successfully published!' }));
        });
      });

    } catch (err) {
      console.error('Publish API Error:', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid publish body payload' }));
    }
  });
}

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Blackstar Codelabs Server is listening on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
