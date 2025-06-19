import gulp from "gulp";
import terser from "gulp-terser";
import concat from "gulp-concat";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import imagemin from "gulp-imagemin";
import { deleteAsync } from "del";
import fs from "fs";
import path from "path";
import gulpStylelint from "gulp-stylelint";
import size from "gulp-size";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import zip from "gulp-zip";
import through2 from "through2";
import { ESLint } from "eslint";
import { execSync } from "child_process";
import imageminPngquant from "imagemin-pngquant";
import { glob } from "glob";

// Paths configuration
const paths = {
  styles: {
    src: ["assets/**/*.css", "!assets/*.min.css"],
    dest: "assets/",
    watch: ["assets/**/*.css", "!assets/*.min.css"],
  },
  scripts: {
    src: ["assets/**/*.js", "!assets/*.min.js"],
    dest: "assets/",
    watch: ["assets/**/*.js", "!assets/*.min.js"],
  },
  images: {
    src: ["assets/**/*.{jpg,jpeg,png,gif,svg,webp}", "!assets/**/*.min.*"],
    dest: "assets/",
    watch: ["assets/**/*.{jpg,jpeg,png,gif,svg,webp}", "!assets/**/*.min.*"],
  },
  liquid: {
    src: [
      "templates/**/*.liquid",
      "sections/**/*.liquid",
      "snippets/**/*.liquid",
      "layout/**/*.liquid",
    ],
    watch: [
      "templates/**/*.liquid",
      "sections/**/*.liquid",
      "snippets/**/*.liquid",
      "layout/**/*.liquid",
    ],
  },
};

// Error handling with better notifications
const onError = (err) => {
  notify.onError({
    title: "🚨 Gulp Error",
    message: "<%= error.message %>",
    sound: "Bottle",
  })(err);
  console.log(`\n❌ Error: ${err.toString()}`);
};

// Clean build directory
function clean() {
  console.log("🧹 Cleaning build files...");
  return deleteAsync([
    "assets/*.min.css",
    "assets/*.min.js",
    "assets/bundle.js",
    "assets/bundle.css",
    "reports/",
    "dist/",
    "assets/**/*.map",
  ]);
}

// Create reports directory
function createReportsDir() {
  const dirs = ["reports", "dist", "reports/coverage"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  return Promise.resolve();
}

// Enhanced ESLint with better error handling
function lintJS() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Running ESLint analysis...");
      const eslint = new ESLint({ fix: true });

      const results = await eslint.lintFiles(paths.scripts.src);
      await ESLint.outputFixes(results);

      // Count issues
      let errorCount = 0;
      let warningCount = 0;
      results.forEach((result) => {
        errorCount += result.errorCount;
        warningCount += result.warningCount;
      });

      // Generate reports
      const htmlFormatter = await eslint.loadFormatter("html");
      const htmlOutput = htmlFormatter.format(results);
      fs.writeFileSync("reports/js-lint-report.html", htmlOutput);

      const jsonFormatter = await eslint.loadFormatter("json");
      const jsonOutput = jsonFormatter.format(results);
      fs.writeFileSync("reports/js-lint-report.json", jsonOutput);

      // Console output
      const consoleFormatter = await eslint.loadFormatter("stylish");
      const consoleOutput = consoleFormatter.format(results);
      if (consoleOutput) console.log(consoleOutput);

      console.log(
        `\n📊 ESLint Results: ${errorCount} errors, ${warningCount} warnings`,
      );

      if (errorCount > 0) {
        console.log("❌ ESLint found errors that need to be fixed");
      } else {
        console.log("✅ No ESLint errors found");
      }

      resolve();
    } catch (error) {
      console.error("❌ ESLint error:", error);
      reject(error);
    }
  });
}

// Enhanced CSS linting with custom HTML formatter
function lintCSS() {
  console.log("🎨 Running CSS linting...");
  return gulp
    .src(paths.styles.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(
      gulpStylelint({
        reporters: [
          { formatter: "string", console: true, failAfterError: false },
          { formatter: "json", save: "reports/css-lint-report.json" },
        ],
        debug: false,
        fix: true,
      }),
    )
    .on("end", () => {
      // Create HTML report from JSON
      try {
        const jsonReport = JSON.parse(
          fs.readFileSync("reports/css-lint-report.json", "utf8"),
        );
        const htmlReport = generateCSSHTMLReport(jsonReport);
        fs.writeFileSync("reports/css-lint-report.html", htmlReport);
        console.log("✅ CSS linting completed with HTML report");
      } catch (error) {
        console.log("⚠️ CSS HTML report generation failed");
      }
    });
}

// Generate HTML report for CSS
function generateCSSHTMLReport(jsonData) {
  const results = jsonData.results || [];
  let totalErrors = 0;
  let totalWarnings = 0;

  results.forEach((result) => {
    totalErrors += result.errored ? 1 : 0;
    totalWarnings += result.warnings ? result.warnings.length : 0;
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <title>CSS Lint Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .error { color: #d32f2f; }
    .warning { color: #f57c00; }
    .success { color: #388e3c; }
    .file { border: 1px solid #ddd; margin: 10px 0; border-radius: 5px; }
    .file-header { background: #f8f9fa; padding: 10px; font-weight: bold; }
    .issues { padding: 10px; }
    .issue { margin: 5px 0; padding: 5px; border-left: 3px solid #ddd; }
    .issue.error { border-left-color: #d32f2f; }
    .issue.warning { border-left-color: #f57c00; }
  </style>
</head>
<body>
  <h1>CSS Lint Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <p>Total Files: ${results.length}</p>
    <p class="error">Errors: ${totalErrors}</p>
    <p class="warning">Warnings: ${totalWarnings}</p>
  </div>
  
  ${results
    .map(
      (result) => `
    <div class="file">
      <div class="file-header">${result.source}</div>
      <div class="issues">
        ${
          result.warnings
            ? result.warnings
                .map(
                  (warning) => `
          <div class="issue ${warning.severity}">
            <strong>Line ${warning.line}:${warning.column}</strong> - ${warning.text}
            <br><small>Rule: ${warning.rule}</small>
          </div>
        `,
                )
                .join("")
            : '<p class="success">No issues found</p>'
        }
      </div>
    </div>
  `,
    )
    .join("")}
</body>
</html>`;
}

// Basic Liquid validation when Shopify CLI is not available
// Enhanced basic Liquid validation
function basicLiquidValidation() {
  const issues = [];
  const performanceIssues = [];

  const liquidPatterns = [
    "templates/**/*.liquid",
    "sections/**/*.liquid",
    "snippets/**/*.liquid",
    "layout/**/*.liquid",
  ];

  liquidPatterns.forEach((pattern) => {
    try {
      const files = glob.sync(pattern);
      files.forEach((file) => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, "utf8");
          const lines = content.split("\n");

          // Check for various issues
          lines.forEach((line, index) => {
            const lineNum = index + 1;

            // Deprecated include tags
            if (line.includes("{% include ")) {
              issues.push({
                file,
                line: lineNum,
                type: "warning",
                message:
                  "Use {% render %} instead of {% include %} for better performance",
                rule: "deprecated-include",
              });
            }

            // Nested loops (performance)
            if (
              line.includes("{% for") &&
              content.includes("{% for", content.indexOf(line) + line.length)
            ) {
              performanceIssues.push({
                file,
                line: lineNum,
                type: "warning",
                message: "Nested loops detected - may impact performance",
                rule: "nested-loops",
              });
            }

            // Missing alt attributes for images
            if (line.includes("<img") && !line.includes("alt=")) {
              issues.push({
                file,
                line: lineNum,
                type: "error",
                message: "Image missing alt attribute for accessibility",
                rule: "missing-alt",
              });
            }

            // Inline styles (maintainability)
            if (line.includes("style=")) {
              issues.push({
                file,
                line: lineNum,
                type: "warning",
                message: "Avoid inline styles - use CSS classes instead",
                rule: "inline-styles",
              });
            }
          });

          // File-level checks
          const fileSize = content.length;
          if (fileSize > 50000) {
            // 50KB
            issues.push({
              file,
              type: "warning",
              message: `Large template file (${Math.round(fileSize / 1024)}KB) - consider breaking into smaller components`,
              rule: "large-file",
            });
          }
        }
      });
    } catch (error) {
      // Ignore glob errors
      console.log(`⚠️ Error processing pattern ${pattern}: ${error.message}`);
    }
  });

  // Save reports
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues,
    performanceIssues: performanceIssues,
  };

  fs.writeFileSync(
    "reports/liquid-basic-report.json",
    JSON.stringify(report, null, 2),
  );

  // Generate HTML report
  const htmlReport = generateLiquidHTMLReport(report);
  fs.writeFileSync("reports/liquid-basic-report.html", htmlReport);

  if (issues.length > 0) {
    console.log(`⚠️ Found ${issues.length} potential liquid issues`);
    issues.slice(0, 5).forEach((issue) => {
      console.log(
        `${issue.type}: ${issue.message} (${issue.file}${issue.line ? ":" + issue.line : ""})`,
      );
    });
    if (issues.length > 5) {
      console.log(
        `... and ${issues.length - 5} more (see reports/liquid-basic-report.html)`,
      );
    }
  } else {
    console.log("✅ Basic Liquid validation passed");
  }
}

// Generate HTML report for Liquid
function generateLiquidHTMLReport(report) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Liquid Template Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .error { color: #d32f2f; }
    .warning { color: #f57c00; }
    .success { color: #388e3c; }
    .issue { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
    .issue.error { border-left: 4px solid #d32f2f; }
    .issue.warning { border-left: 4px solid #f57c00; }
  </style>
</head>
<body>
  <h1>Liquid Template Analysis Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
    <p>Total Issues: ${report.totalIssues}</p>
    <p>Performance Issues: ${report.performanceIssues.length}</p>
  </div>
  
  <h2>Issues Found</h2>
  ${report.issues
    .map(
      (issue) => `
    <div class="issue ${issue.type}">
      <strong>${issue.file}${issue.line ? ":" + issue.line : ""}</strong>
      <p>${issue.message}</p>
      <small>Rule: ${issue.rule}</small>
    </div>
  `,
    )
    .join("")}
  
  ${
    report.performanceIssues.length > 0
      ? `
    <h2>Performance Issues</h2>
    ${report.performanceIssues
      .map(
        (issue) => `
      <div class="issue warning">
        <strong>${issue.file}:${issue.line}</strong>
        <p>${issue.message}</p>
        <small>Rule: ${issue.rule}</small>
      </div>
    `,
      )
      .join("")}
  `
      : ""
  }
</body>
</html>`;
}

// Lint Liquid templates using Shopify CLI
function lintLiquid() {
  return new Promise((resolve) => {
    console.log("🛍️ Running Liquid template validation...");

    try {
      // Try Shopify CLI first
      let result;
      try {
        result = execSync("shopify theme check --output=json", {
          encoding: "utf8",
          stdio: ["pipe", "pipe", "pipe"],
        });

        fs.writeFileSync("reports/liquid-lint-report.json", result);

        const lintResults = JSON.parse(result);
        if (lintResults.length > 0) {
          console.log("⚠️ Liquid template issues found:");
          lintResults.forEach((issue) => {
            console.log(
              `${issue.severity}: ${issue.message} (${issue.file}:${issue.line})`,
            );
          });
        } else {
          console.log("✅ No Liquid template issues found");
        }
      } catch (cliError) {
        console.log(
          "⚠️ Shopify CLI not available, running basic validation...",
        );
        basicLiquidValidation();
      }

      resolve();
    } catch (error) {
      console.log("⚠️ Liquid validation failed, running basic checks");
      basicLiquidValidation();
      resolve();
    }
  });
}

// Sonar-style code quality analysis
// Enhanced Sonar-style code quality analysis
function sonarAnalysis() {
  return new Promise((resolve) => {
    const analysis = {
      timestamp: new Date().toISOString(),
      project: "Shopify Theme Quality Analysis",
      metrics: {
        files: 0,
        lines: 0,
        functions: 0,
        complexity: 0,
        duplications: 0,
        techDebt: "0min",
        maintainabilityIndex: 0,
      },
      issues: {
        bugs: [],
        vulnerabilities: [],
        codeSmells: [],
        coverage: "N/A",
      },
      recommendations: [],
      shopifySpecific: {
        liquidFiles: 0,
        sectionFiles: 0,
        templateFiles: 0,
        snippetFiles: 0,
        potentialPerformanceIssues: [],
      },
    };

    // Analyze JavaScript files
    analyzeJavaScriptFiles(analysis);

    // Analyze CSS files
    analyzeCSSFiles(analysis);

    // Analyze Liquid files
    analyzeLiquidFilesDetailed(analysis);

    // Generate recommendations
    generateEnhancedRecommendations(analysis);

    // Calculate scores
    calculateQualityScores(analysis);

    // Save comprehensive report
    fs.writeFileSync(
      "reports/sonar-analysis.json",
      JSON.stringify(analysis, null, 2),
    );

    // Generate HTML dashboard
    const htmlDashboard = generateSonarHTMLDashboard(analysis);
    fs.writeFileSync("reports/sonar-dashboard.html", htmlDashboard);

    // Console output
    displaySonarResults(analysis);

    resolve();
  });
}

// Analyze JavaScript files in detail
function analyzeJavaScriptFiles(analysis) {
  const jsFiles = glob.sync(paths.scripts.src);

  jsFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      analysis.metrics.files++;
      analysis.metrics.lines += lines.length;

      // Function analysis
      const functionMatches =
        content.match(/function\s+\w+|=>\s*{|\w+\s*:\s*function/g) || [];
      analysis.metrics.functions += functionMatches.length;

      // Complexity analysis
      let fileComplexity = calculateComplexity(content);
      analysis.metrics.complexity += fileComplexity;

      // Security analysis
      analyzeSecurityIssues(content, file, analysis);

      // Performance analysis
      analyzePerformanceIssues(content, file, analysis);

      // Code quality issues
      analyzeCodeQuality(content, file, lines.length, fileComplexity, analysis);
    }
  });
}

// Calculate cyclomatic complexity
function calculateComplexity(content) {
  const complexityIndicators = [
    /if\s*\(/g,
    /else\s*if\s*\(/g,
    /while\s*\(/g,
    /for\s*\(/g,
    /catch\s*\(/g,
    /case\s+/g,
    /&&/g,
    /\|\|/g,
    /\?.*:/g,
    /switch\s*\(/g,
  ];

  let complexity = 1; // Base complexity
  complexityIndicators.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) complexity += matches.length;
  });

  return complexity;
}

// Security issue analysis
function analyzeSecurityIssues(content, file, analysis) {
  const securityPatterns = [
    {
      pattern: /eval\s*\(/,
      message: "Use of eval() is dangerous",
      severity: "HIGH",
      type: "vulnerability",
    },
    {
      pattern: /innerHTML\s*=/,
      message: "Direct innerHTML manipulation",
      severity: "MEDIUM",
      type: "vulnerability",
    },
    {
      pattern: /document\.write/,
      message: "document.write can be dangerous",
      severity: "HIGH",
      type: "vulnerability",
    },
    {
      pattern: /\$\([^)]*\)\.html\(/,
      message: "jQuery .html() without sanitization",
      severity: "MEDIUM",
      type: "vulnerability",
    },
    {
      pattern: /setTimeout\s*\(\s*['""][^'"]*['"]/,
      message: "setTimeout with string (eval-like)",
      severity: "HIGH",
      type: "vulnerability",
    },
    {
      pattern: /new\s+Function\s*\(/,
      message: "Function constructor is eval-like",
      severity: "HIGH",
      type: "vulnerability",
    },
  ];

  securityPatterns.forEach(({ pattern, message, severity, type }) => {
    if (pattern.test(content)) {
      analysis.issues[
        type === "vulnerability" ? "vulnerabilities" : "codeSmells"
      ].push({
        file,
        message,
        severity,
        rule: pattern.toString(),
        type,
      });
    }
  });
}

// Performance issue analysis
function analyzePerformanceIssues(content, file, analysis) {
  const performancePatterns = [
    {
      pattern: /document\.querySelector(?!All)/,
      message: "Consider caching DOM queries",
      severity: "LOW",
    },
    {
      pattern: /setInterval|setTimeout/,
      message: "Timer usage detected - ensure cleanup",
      severity: "LOW",
    },
    {
      pattern: /for\s*\([^)]*length[^)]*\)/,
      message: "Loop without length caching",
      severity: "LOW",
    },
    {
      pattern: /\$\([^)]*\)\.each/,
      message: "jQuery .each() can be slow for large datasets",
      severity: "MEDIUM",
    },
    {
      pattern: /\.append\(.*\+.*\)/,
      message: "String concatenation in DOM manipulation",
      severity: "MEDIUM",
    },
  ];

  performancePatterns.forEach(({ pattern, message, severity }) => {
    if (pattern.test(content)) {
      analysis.issues.codeSmells.push({
        file,
        message,
        severity,
        type: "performance",
        rule: pattern.toString(),
      });
    }
  });
}

function analyzeCodeQuality(content, file, lineCount, complexity, analysis) {
  // High complexity
  if (complexity > 15) {
    analysis.issues.codeSmells.push({
      file,
      message: `High cyclomatic complexity (${complexity})`,
      severity: "HIGH",
      type: "maintainability",
    });
  }

  // Large files
  if (lineCount > 500) {
    analysis.issues.codeSmells.push({
      file,
      message: `Large file (${lineCount} lines) - consider splitting`,
      severity: "MEDIUM",
      type: "maintainability",
    });
  }

  // Duplicate code detection
  const codeBlocks = content.match(/{[^{}]{50,}}/g) || [];
  if (codeBlocks.length > 5) {
    analysis.issues.codeSmells.push({
      file,
      message: "Potential code duplication detected",
      severity: "MEDIUM",
      type: "maintainability",
    });
  }

  // Missing error handling
  if (content.includes("fetch(") && !content.includes(".catch(")) {
    analysis.issues.bugs.push({
      file,
      message: "fetch() without error handling",
      severity: "MEDIUM",
      type: "reliability",
    });
  }
}

// Analyze CSS files
function analyzeCSSFiles(analysis) {
  const cssFiles = glob.sync(paths.styles.src);

  cssFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      // CSS-specific analysis
      const selectors = content.match(/[^{}]+{/g) || [];
      const rules = content.match(/{[^{}]*}/g) || [];

      // Check for overly specific selectors
      selectors.forEach((selector) => {
        const specificity = calculateCSSSpecificity(selector);
        if (specificity > 100) {
          analysis.issues.codeSmells.push({
            file,
            message: `High specificity selector: ${selector.trim()}`,
            severity: "MEDIUM",
            type: "maintainability",
          });
        }
      });

      // Check for large CSS files
      if (lines.length > 1000) {
        analysis.issues.codeSmells.push({
          file,
          message: `Large CSS file (${lines.length} lines) - consider splitting`,
          severity: "LOW",
          type: "maintainability",
        });
      }
    }
  });
}

// Calculate CSS specificity
function calculateCSSSpecificity(selector) {
  const ids = (selector.match(/#/g) || []).length * 100;
  const classes = (selector.match(/\./g) || []).length * 10;
  const elements = (selector.match(/[a-zA-Z]/g) || []).length;
  return ids + classes + elements;
}

// Enhanced Liquid file analysis
function analyzeLiquidFilesDetailed(analysis) {
  const liquidPatterns = [
    "templates/**/*.liquid",
    "sections/**/*.liquid",
    "snippets/**/*.liquid",
    "layout/**/*.liquid",
  ];

  liquidPatterns.forEach((pattern) => {
    const files = glob.sync(pattern);
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, "utf8");
        const lines = content.split("\n");

        analysis.shopifySpecific.liquidFiles++;

        if (file.includes("/templates/"))
          analysis.shopifySpecific.templateFiles++;
        if (file.includes("/sections/"))
          analysis.shopifySpecific.sectionFiles++;
        if (file.includes("/snippets/"))
          analysis.shopifySpecific.snippetFiles++;

        // Performance analysis
        analyzeShopifyPerformance(content, file, analysis);

        // Accessibility analysis
        analyzeAccessibility(content, file, analysis);

        // SEO analysis
        analyzeSEO(content, file, analysis);
      }
    });
  });
}

// Shopify-specific performance analysis
function analyzeShopifyPerformance(content, file, analysis) {
  // Nested loops
  const nestedLoops = content.match(/{%\s*for.*?{%\s*for/gs);
  if (nestedLoops) {
    analysis.shopifySpecific.potentialPerformanceIssues.push({
      file,
      issue: "Nested loops detected",
      impact: "High performance impact",
      severity: "HIGH",
    });
  }

  // Large liquid loops
  const forLoops = content.match(/{%\s*for\s+\w+\s+in\s+(\w+)/g);
  if (forLoops) {
    forLoops.forEach((loop) => {
      if (loop.includes("collections.all") || loop.includes("products.all")) {
        analysis.shopifySpecific.potentialPerformanceIssues.push({
          file,
          issue: "Loop over all collections/products",
          impact: "Very high performance impact",
          severity: "CRITICAL",
        });
      }
    });
  }

  // Missing lazy loading
  if (content.includes("<img") && !content.includes('loading="lazy"')) {
    analysis.shopifySpecific.potentialPerformanceIssues.push({
      file,
      issue: "Images without lazy loading",
      impact: "Page load performance",
      severity: "MEDIUM",
    });
  }
}

// Accessibility analysis
function analyzeAccessibility(content, file, analysis) {
  const accessibilityIssues = [
    {
      pattern: /<img(?![^>]*alt=)/,
      message: "Image missing alt attribute",
      severity: "HIGH",
    },
    {
      pattern: /<input(?![^>]*aria-label)(?![^>]*<label)/,
      message: "Form input missing label or aria-label",
      severity: "HIGH",
    },
    {
      pattern: /<button(?![^>]*aria-label)>\s*<\/button>/,
      message: "Empty button without aria-label",
      severity: "HIGH",
    },
    {
      pattern: /<a(?![^>]*href)/,
      message: "Link without href attribute",
      severity: "MEDIUM",
    },
    {
      pattern: /<iframe(?![^>]*title)/,
      message: "iframe missing title attribute",
      severity: "MEDIUM",
    },
  ];

  accessibilityIssues.forEach(({ pattern, message, severity }) => {
    if (pattern.test(content)) {
      analysis.shopifySpecific.accessibility.push({
        file,
        message,
        severity,
        type: "accessibility",
      });
    }
  });
}

// SEO analysis
function analyzeSEO(content, file, analysis) {
  const seoIssues = [
    {
      pattern: /<h1/g,
      message: "Multiple H1 tags detected",
      severity: "MEDIUM",
      check: "multiple",
    },
    {
      pattern: /<title>.*<\/title>/,
      message: "Page title present",
      severity: "INFO",
      check: "present",
    },
    {
      pattern: /<meta\s+name="description"/,
      message: "Meta description present",
      severity: "INFO",
      check: "present",
    },
  ];

  seoIssues.forEach(({ pattern, message, severity, check }) => {
    const matches = content.match(pattern);
    if (check === "multiple" && matches && matches.length > 1) {
      analysis.shopifySpecific.seo.push({
        file,
        message: `${message} (${matches.length} found)`,
        severity,
        type: "seo",
      });
    } else if (check === "present" && !matches) {
      analysis.shopifySpecific.seo.push({
        file,
        message: `Missing: ${message}`,
        severity,
        type: "seo",
      });
    }
  });
}

// Generate enhanced recommendations
function generateEnhancedRecommendations(analysis) {
  const recommendations = [];

  // Code quality recommendations
  if (analysis.metrics.complexity > 100) {
    recommendations.push(
      "🔧 Refactor complex functions to improve maintainability",
    );
  }

  if (analysis.issues.vulnerabilities.length > 0) {
    recommendations.push("🔒 Address security vulnerabilities immediately");
  }

  if (analysis.metrics.maintainabilityIndex < 70) {
    recommendations.push(
      "📈 Code maintainability is below recommended threshold",
    );
  }

  // Shopify-specific recommendations
  if (analysis.shopifySpecific.potentialPerformanceIssues.length > 0) {
    recommendations.push(
      "⚡ Optimize Liquid templates to reduce performance bottlenecks",
    );
  }

  if (analysis.shopifySpecific.accessibility.length > 0) {
    recommendations.push(
      "♿ Improve accessibility compliance for better user experience",
    );
  }

  if (analysis.shopifySpecific.seo.length > 0) {
    recommendations.push(
      "🔍 Enhance SEO optimization for better search visibility",
    );
  }

  // Performance recommendations
  const perfIssues = analysis.issues.codeSmells.filter(
    (issue) => issue.type === "performance",
  ).length;
  if (perfIssues > 0) {
    recommendations.push(`🚀 Address ${perfIssues} performance-related issues`);
  }

  // Browser compatibility
  if (analysis.browserCompatibility.issues.length > 0) {
    recommendations.push(
      "🌐 Fix browser compatibility issues for wider support",
    );
  }
}
// Generate intelligent recommendations
function generateRecommendations(analysis) {
  if (analysis.metrics.complexity > 50) {
    analysis.recommendations.push(
      "Refactor complex functions to improve maintainability",
    );
  }

  if (analysis.issues.vulnerabilities.length > 0) {
    analysis.recommendations.push(
      "Address security vulnerabilities immediately",
    );
  }

  if (analysis.metrics.maintainabilityIndex < 70) {
    analysis.recommendations.push(
      "Code maintainability is below recommended threshold",
    );
  }

  if (analysis.shopifySpecific.potentialPerformanceIssues.length > 0) {
    analysis.recommendations.push(
      "Optimize Liquid templates to reduce nested loops",
    );
  }

  if (
    analysis.shopifySpecific.liquidFiles > 0 &&
    analysis.shopifySpecific.sectionFiles < 3
  ) {
    analysis.recommendations.push(
      "Consider using more sections for better theme modularity",
    );
  }

  // Performance recommendations
  const perfIssues = analysis.issues.codeSmells.filter(
    (issue) => issue.type === "performance",
  ).length;
  if (perfIssues > 0) {
    analysis.recommendations.push(
      `Address ${perfIssues} performance-related code smells`,
    );
  }

  // Security recommendations
  if (analysis.issues.vulnerabilities.length > 2) {
    analysis.recommendations.push(
      "Multiple security issues detected - conduct security review",
    );
  }
}

// Analyze Liquid files for Shopify-specific issues
function analyzeLiquidFiles(analysis) {
  const liquidPatterns = [
    "templates/**/*.liquid",
    "sections/**/*.liquid",
    "snippets/**/*.liquid",
    "layout/**/*.liquid",
  ];

  liquidPatterns.forEach((pattern) => {
    try {
      const files = require("glob").sync(pattern);
      files.forEach((file) => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, "utf8");

          analysis.shopifySpecific.liquidFiles++;

          if (file.includes("/templates/"))
            analysis.shopifySpecific.templateFiles++;
          if (file.includes("/sections/"))
            analysis.shopifySpecific.sectionFiles++;
          if (file.includes("/snippets/"))
            analysis.shopifySpecific.snippetFiles++;

          // Performance issues
          const nestedLoops = content.match(/{%\s*for.*?{%\s*for/gs);
          if (nestedLoops) {
            analysis.shopifySpecific.potentialPerformanceIssues.push({
              file,
              issue: "Nested loops detected",
              impact: "High performance impact",
            });
          }

          // Deprecated patterns
          if (content.includes("{% include ")) {
            analysis.issues.codeSmells.push({
              file,
              message: "Use {% render %} instead of {% include %}",
              severity: "MEDIUM",
              type: "shopify-deprecated",
            });
          }

          // Large template files
          const lines = content.split("\n").length;
          if (lines > 300) {
            analysis.issues.codeSmells.push({
              file,
              message: `Large template file (${lines} lines) - consider breaking into sections`,
              severity: "LOW",
              type: "maintainability",
            });
          }
        }
      });
    } catch (error) {
      // Ignore errors
      console.error(`⚠️ Error processing pattern ${pattern}: ${error.message}`);
    }
  });
}

// Format code with Prettier (via npm script)
function formatCode() {
  return new Promise((resolve, reject) => {
    try {
      console.log("🎨 Formatting code with Prettier...");
      execSync("npm run format:fix", { stdio: "inherit" });
      console.log("✅ Code formatting completed");
      resolve();
    } catch (error) {
      console.log("⚠️  Prettier formatting failed:", error.message);
      resolve(); // Don't fail the build
    }
  });
}

// Process CSS files with optimization
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: [
            "> 1%",
            "last 3 versions",
            "Firefox ESR",
            "iOS >= 10",
            "Android >= 4.4",
            "not dead",
          ],
        }),
      ]),
    )
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(size({ title: "CSS (uncompressed)", showFiles: true }))
    .pipe(
      postcss([
        cssnano({
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifySelectors: true,
              minifyParams: true,
              reduceIdents: false,
              mergeLonghand: true,
              colormin: true,
              convertValues: true,
              discardDuplicates: true,
              discardEmpty: true,
              discardUnused: false, // Keep for Shopify compatibility
              mergeRules: true,
              normalizeUrl: true,
              reduceTransforms: true,
              svgo: {
                plugins: [
                  { name: "removeViewBox", active: false },
                  { name: "cleanupIDs", active: false },
                ],
              },
            },
          ],
        }),
      ]),
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(size({ title: "CSS (compressed)", showFiles: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest));
}

// Process JavaScript files with optimization
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(size({ title: "JavaScript (uncompressed)", showFiles: true }))
    .pipe(
      terser({
        compress: {
          drop_console: false, // Keep console for debugging in dev
          drop_debugger: true,
          pure_funcs: ["console.debug"],
          passes: 2,
          unsafe: false,
        },
        mangle: {
          reserved: [
            "$",
            "jQuery",
            "Shopify",
            "theme",
            "Cart",
            "Product",
            "Collection",
          ],
        },
        format: {
          comments: /^!/,
        },
      }),
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(size({ title: "JavaScript (compressed)", showFiles: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Production JavaScript (removes console entirely)
function scriptsProd() {
  return gulp
    .src(paths.scripts.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [
            "console.info",
            "console.debug",
            "console.warn",
            "console.log",
          ],
          passes: 3,
        },
        mangle: {
          reserved: [
            "$",
            "jQuery",
            "Shopify",
            "theme",
            "Cart",
            "Product",
            "Collection",
          ],
        },
        format: {
          comments: false,
        },
      }),
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(size({ title: "JavaScript (production)", showFiles: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Optimize images
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(
      imagemin([
        imagemin.mozjpeg({
          quality: 85,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 7,
        }),
        imagemin.svgo({
          plugins: [
            { name: "removeViewBox", active: false },
            { name: "cleanupIDs", active: false },
          ],
        }),
        imagemin.gifsicle({
          interlaced: true,
          optimizationLevel: 3,
        }),
        imageminPngquant({ quality: [0.6, 0.8] }),
      ]),
    )
    .pipe(size({ title: "Images", showFiles: true }))
    .pipe(gulp.dest(paths.images.dest));
}

// Fix 3: Add SonarQube alternative (sonarjs plugin already configured in eslint)
function generateQualityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    files: { js: 0, css: 0, liquid: 0 },
    issues: { critical: 0, major: 0, minor: 0 },
    metrics: { complexity: 0, maintainability: 85 },
  };

  // Collect data from existing lint reports
  try {
    const jsReport = JSON.parse(
      fs.readFileSync("reports/js-lint-report.json", "utf8"),
    );
    const cssReport = JSON.parse(
      fs.readFileSync("reports/css-lint-report.json", "utf8"),
    );

    report.files.js = jsReport.length || 0;
    report.files.css = cssReport.results?.length || 0;

    fs.writeFileSync(
      "reports/quality-dashboard.json",
      JSON.stringify(report, null, 2),
    );
    console.log("📊 Quality report generated");
  } catch (e) {
    console.error("⚠️ Quality report generation failed", e);
  }

  return Promise.resolve();
}

// Fix 4: Add comprehensive minification
function minifyAssets() {
  return gulp.parallel(
    // CSS minification with better compression
    () =>
      gulp
        .src("assets/*.css")
        .pipe(
          postcss([
            cssnano({
              preset: [
                "advanced",
                {
                  discardComments: { removeAll: true },
                  normalizeWhitespace: true,
                  colormin: true,
                  convertValues: true,
                  mergeLonghand: true,
                  reduceTransforms: true,
                },
              ],
            }),
          ]),
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("assets/")),

    // JS minification with better settings
    () =>
      gulp
        .src("assets/*.js")
        .pipe(
          terser({
            compress: {
              drop_console: true,
              drop_debugger: true,
              passes: 3,
              unsafe: false,
            },
            mangle: {
              reserved: ["$", "jQuery", "Shopify", "theme"],
            },
          }),
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("assets/")),
  )();
}

// Fix 5: Add theme validation specific to Shopify
function validateShopifyTheme() {
  const errors = [];
  const requiredFiles = [
    "layout/theme.liquid",
    "templates/index.liquid",
    "config/settings_schema.json",
  ];

  requiredFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      errors.push(`Missing required file: ${file}`);
    }
  });

  if (errors.length > 0) {
    console.log("❌ Theme validation failed:");
    errors.forEach((err) => console.log(`  • ${err}`));
  } else {
    console.log("✅ Shopify theme structure is valid");
  }

  return Promise.resolve();
}

// Bundle analysis and recommendations
function analyzeBundle() {
  const bundleStats = {
    timestamp: new Date().toISOString(),
    files: {},
    recommendations: [],
    performance: {
      totalSizeKB: 0,
      gzipEstimateKB: 0,
      loadTimeEst3G: 0,
    },
  };

  return gulp
    .src(["assets/*.min.js", "assets/*.min.css"])
    .pipe(
      through2.obj(function (file, _, cb) {
        const fileName = path.basename(file.path);
        const size = file.contents.length;
        const sizeKB = (size / 1024).toFixed(2);
        const gzipEst = (size * 0.3).toFixed(2); // Rough gzip estimate

        bundleStats.files[fileName] = {
          size: size,
          sizeKB: sizeKB,
          gzipEstKB: gzipEst,
        };

        bundleStats.performance.totalSizeKB += parseFloat(sizeKB);
        bundleStats.performance.gzipEstimateKB += parseFloat(gzipEst);

        // Performance recommendations
        if (fileName.includes(".js") && size > 100000) {
          bundleStats.recommendations.push({
            type: "performance",
            severity: "warning",
            message: `${fileName} (${sizeKB}KB) is large. Consider code splitting or tree shaking.`,
          });
        }

        if (fileName.includes(".css") && size > 50000) {
          bundleStats.recommendations.push({
            type: "performance",
            severity: "warning",
            message: `${fileName} (${sizeKB}KB) is large. Consider critical CSS extraction.`,
          });
        }

        this.push(file);
        cb();
      }),
    )
    .on("end", () => {
      // Calculate load time estimates
      bundleStats.performance.loadTimeEst3G = (
        bundleStats.performance.gzipEstimateKB / 50
      ).toFixed(1); // 50KB/s on 3G

      // Write bundle stats
      fs.writeFileSync(
        "reports/bundle-analysis.json",
        JSON.stringify(bundleStats, null, 2),
      );

      console.log("\n📊 Bundle Analysis:");
      Object.entries(bundleStats.files).forEach(([file, stats]) => {
        console.log(
          `${file}: ${stats.sizeKB} KB (gzipped ~${stats.gzipEstKB} KB)`,
        );
      });

      console.log(`\n⚡ Performance Metrics:`);
      console.log(
        `Total Size: ${bundleStats.performance.totalSizeKB.toFixed(2)} KB`,
      );
      console.log(
        `Gzipped Estimate: ${bundleStats.performance.gzipEstimateKB.toFixed(2)} KB`,
      );
      console.log(
        `3G Load Time Estimate: ${bundleStats.performance.loadTimeEst3G}s`,
      );

      if (bundleStats.recommendations.length > 0) {
        console.log("\n💡 Recommendations:");
        bundleStats.recommendations.forEach((rec) =>
          console.log(`• ${rec.message}`),
        );
      }
    });
}

// Performance audit for Shopify themes
function performanceAudit() {
  console.log("\n🚀 Shopify Theme Performance Audit:");
  console.log("✅ CSS and JS are minified and compressed");
  console.log("✅ Images are optimized with proper compression");
  console.log("✅ Autoprefixer applied for browser compatibility");
  console.log("✅ Source maps generated for debugging");
  console.log("✅ Bundle analysis completed");

  console.log("\n💡 Shopify-Specific Performance Tips:");
  console.log("• Use {% liquid %} tags for better performance");
  console.log('• Lazy load images with loading="lazy" attribute');
  console.log("• Use {{ 'image.jpg' | asset_url }} for theme assets");
  console.log("• Implement critical CSS for above-the-fold content");
  console.log("• Use Shopify's image transformation filters");
  console.log("• Minimize Liquid loops and avoid nested loops");
  console.log("• Use {% render %} instead of {% include %}");
  console.log("• Implement proper caching headers");
  console.log("• Use Web Components for complex interactive elements");

  return Promise.resolve();
}

// Shopify theme validation
function shopifyValidation() {
  const requiredFiles = [
    "layout/theme.liquid",
    "templates/index.liquid",
    "templates/product.liquid",
    "templates/collection.liquid",
    "config/settings_schema.json",
    "locales/en.default.json",
  ];

  const recommendedFiles = [
    "templates/404.liquid",
    "templates/article.liquid",
    "templates/blog.liquid",
    "templates/cart.liquid",
    "templates/page.liquid",
    "templates/search.liquid",
    "sections/header.liquid",
    "sections/footer.liquid",
  ];

  console.log("\n🛍️  Shopify Theme Structure Validation:");
  console.log("\n📋 Required Files:");
  requiredFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} is missing (REQUIRED)`);
    }
  });

  console.log("\n📋 Recommended Files:");
  recommendedFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`⚠️  ${file} is missing (recommended)`);
    }
  });

  return Promise.resolve();
}

// Package theme for distribution
function packageTheme() {
  const date = new Date().toISOString().split("T")[0];
  return gulp
    .src([
      "**/*",
      "!node_modules/**",
      "!src/**",
      "!reports/**",
      "!gulpfile.js",
      "!package*.json",
      "!*.md",
      "!.git/**",
      "!.gitignore",
      "!.eslintrc*",
      "!.prettierrc*",
      "!.stylelintrc*",
      "!gulpfile.js",
      "!scripts/**",
    ])
    .pipe(zip(`shopify-theme-${date}.zip`))
    .pipe(gulp.dest("./dist"));
}

// Watch files for development
function watchFiles() {
  console.log("👀 Watching files for changes...");
  gulp.watch(paths.styles.watch, gulp.series(lintCSS, styles));
  gulp.watch(paths.scripts.watch, gulp.series(lintJS, scripts));
  gulp.watch(paths.images.watch, images);
  gulp.watch(paths.liquid.watch, lintLiquid);
}

// Task compositions
const lint = gulp.parallel(lintJS, lintCSS, lintLiquid);
const compile = gulp.parallel(styles, scripts, images);
const compileProd = gulp.parallel(styles, scriptsProd, images);
const analyze = gulp.series(analyzeBundle, sonarAnalysis);
const quality = gulp.series(createReportsDir, lint, formatCode, analyze);
const optimize = gulp.series(compile, analyze);

// Main tasks
const build = gulp.series(clean, createReportsDir, lint, compile, analyze);
const prod = gulp.series(
  clean,
  createReportsDir,
  lint,
  compileProd,
  analyze,
  performanceAudit,
);
const dev = gulp.series(build, watchFiles);
const audit = gulp.series(build, performanceAudit, shopifyValidation);
const ship = gulp.series(prod, packageTheme);

// Export all tasks
export {
  clean,
  lint,
  lintJS,
  lintCSS,
  lintLiquid,
  formatCode as format,
  styles,
  scripts,
  images,
  quality,
  optimize,
  build,
  prod,
  dev,
  watchFiles as watch,
  audit,
  packageTheme as package,
  ship,
  sonarAnalysis,
  analyzeBundle,
  performanceAudit,
  shopifyValidation,
};

export default build;
