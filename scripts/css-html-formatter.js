// scripts/css-html-formatter.js
const fs = require("fs");
const path = require("path");

module.exports = function (results) {
  const reportPath = path.resolve(__dirname, "../reports/css-lint-report.html");
  // Process results and handle missing properties
  const issues = results.reduce((acc, result) => {
    const filePath = result.source || "unknown-file.css";
    return [
      ...acc,
      ...result.warnings.map((warning) => ({
        ...warning,
        filePath,
        position: `${warning.line}:${warning.column}`,
      })),
    ];
  }, []);

  // Create HTML report
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CSS Lint Report</title>
  <style>
    body { font-family: sans-serif; margin: 2em; }
    h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .summary { 
      margin: 1em 0; 
      padding: 1em; 
      background-color: #f5f5f5; 
      border-radius: 4px; 
      display: flex;
      justify-content: space-between;
    }
    .error-count { color: #d32f2f; }
    .warning-count { color: #ed6c02; }
    .issue { 
      margin-bottom: 1em; 
      padding: 1em; 
      border-left: 4px solid; 
      border-radius: 0 4px 4px 0; 
    }
    .error { border-color: #d32f2f; background-color: #ffebee; }
    .warning { border-color: #ed6c02; background-color: #fff4e5; }
    .file { 
      font-weight: bold; 
      margin-bottom: 0.5em; 
      display: flex;
      justify-content: space-between;
    }
    .message { margin-bottom: 0.3em; }
    .rule { font-size: 0.9em; color: #666; }
    a { color: #1976d2; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .position { font-family: monospace; color: #666; }
  </style>
</head>
<body>
  <h1>CSS Lint Report</h1>
  
  <div class="summary">
    <div>Files processed: ${results.length}</div>
    <div>Issues found: <span class="error-count">${issues.filter((i) => i.severity === "error").length} errors</span>, 
         <span class="warning-count">${issues.filter((i) => i.severity === "warning").length} warnings</span></div>
  </div>
  
  ${issues
    .map((issue) => {
      const relativePath = issue.filePath.startsWith(process.cwd())
        ? path.relative(process.cwd(), issue.filePath)
        : issue.filePath;

      return `
    <div class="issue ${issue.severity === "error" ? "error" : "warning"}">
      <div class="file">
        <a href="vscode://file/${path.resolve(issue.filePath)}" title="Open file in VS Code">
          ${relativePath}
        </a>
        <span class="position">Line ${issue.line}, Col ${issue.column}</span>
      </div>
      <div class="message">${issue.text}</div>
      <div class="rule">Rule: ${issue.rule}</div>
    </div>
    `;
    })
    .join("")}
  
  <script>
    // Add line number links
    document.querySelectorAll('.file a').forEach(link => {
      const positionElement = link.nextElementSibling;
      if (positionElement && positionElement.classList.contains('position')) {
        const match = positionElement.textContent.match(/Line (\\d+), Col (\\d+)/);
        if (match) {
          const line = match[1];
          const col = match[2];
          link.href = \`vscode://file/\${link.getAttribute('href')}::\`;
        }
      }
    });
  </script>
</body>
</html>`;

  // Ensure reports directory exists
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, html);
  return html;
};
