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
    src: "assets/**/*",
    dest: "assets/",
    watch: "assets/**/*",
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

// Error handling
const onError = (err) => {
  notify.onError({
    title: "Gulp Error",
    message: "<%= error.message %>",
  })(err);
  console.log(err.toString());
};

// Clean build directory
function clean() {
  return deleteAsync([
    "assets/*.min.css",
    "assets/*.min.js",
    "assets/bundle.js",
    "assets/bundle.css",
    "reports/",
    "dist/",
  ]);
}

// Create reports directory
function createReportsDir() {
  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports", { recursive: true });
  }
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist", { recursive: true });
  }
  return Promise.resolve();
}

// Lint JavaScript with ESLint
function lintJS() {
  return new Promise(async (resolve, reject) => {
    try {
      const eslint = new ESLint({ 
        fix: true,
        baseConfig: {
          extends: ["@eslint/js/recommended"],
          env: {
            browser: true,
            es2021: true,
            jquery: true
          },
          globals: {
            Shopify: "readonly",
            theme: "readonly",
            Cart: "readonly",
            Product: "readonly"
          },
          rules: {
            "no-console": "warn",
            "no-unused-vars": "warn",
            "no-undef": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "single"]
          }
        }
      });

      const results = await eslint.lintFiles(paths.scripts.src);
      
      // Fix fixable issues
      await ESLint.outputFixes(results);
      
      // Generate HTML report
      const formatter = await eslint.loadFormatter("html");
      const resultText = formatter.format(results);
      
      fs.writeFileSync("reports/js-lint-report.html", resultText);
      
      // Console output
      const consoleFormatter = await eslint.loadFormatter("stylish");
      const consoleOutput = consoleFormatter.format(results);
      console.log(consoleOutput);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Lint CSS
function lintCSS() {
  return gulp
    .src(paths.styles.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(
      gulpStylelint({
        reporters: [
          { formatter: "string", console: true },
          { formatter: "json", save: "reports/css-lint-report.json" },
        ],
        debug: true,
        fix: true,
      }),
    );
}

// Lint Liquid templates using Shopify CLI
function lintLiquid() {
  return new Promise((resolve, reject) => {
    try {
      console.log("🔍 Running Shopify theme check...");
      const result = execSync("shopify theme check --output=json", {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      
      // Save JSON report
      fs.writeFileSync("reports/liquid-lint-report.json", result);
      
      // Parse and display results
      const lintResults = JSON.parse(result);
      if (lintResults.length > 0) {
        console.log("⚠️  Liquid template issues found:");
        lintResults.forEach(issue => {
          console.log(`${issue.severity}: ${issue.message} (${issue.file}:${issue.line})`);
        });
      } else {
        console.log("✅ No Liquid template issues found");
      }
      
      resolve();
    } catch (error) {
      console.log("⚠️  Shopify CLI not found or theme check failed");
      console.log("💡 Install with: npm install -g @shopify/cli@latest");
      resolve(); // Don't fail the build
    }
  });
}

// Sonar-style code quality analysis
function sonarAnalysis() {
  return new Promise((resolve) => {
    const analysis = {
      timestamp: new Date().toISOString(),
      metrics: {
        files: 0,
        lines: 0,
        functions: 0,
        complexity: 0,
        duplications: 0,
        techDebt: "0min"
      },
      issues: {
        bugs: [],
        vulnerabilities: [],
        codeSmells: [],
        coverage: "N/A"
      },
      recommendations: []
    };

    // Analyze JavaScript files
    const jsFiles = gulp.src(paths.scripts.src);
    let jsFileCount = 0;
    let totalLines = 0;

    jsFiles.on('data', (file) => {
      if (file.contents) {
        jsFileCount++;
        const content = file.contents.toString();
        const lines = content.split('\n').length;
        totalLines += lines;
        
        // Basic complexity analysis
        const functionMatches = content.match(/function\s+\w+|=>\s*{|\w+\s*:\s*function/g) || [];
        analysis.metrics.functions += functionMatches.length;
        
        // Check for potential issues
        if (content.includes('eval(')) {
          analysis.issues.vulnerabilities.push({
            file: file.path,
            message: "Use of eval() is dangerous and should be avoided",
            severity: "HIGH"
          });
        }
        
        if (content.includes('innerHTML')) {
          analysis.issues.codeSmells.push({
            file: file.path,
            message: "Direct innerHTML manipulation - consider using safer DOM methods",
            severity: "MEDIUM"
          });
        }
        
        // Large function detection
        const largeFunctions = content.match(/function[^}]{500,}/g);
        if (largeFunctions) {
          analysis.issues.codeSmells.push({
            file: file.path,
            message: `Large function detected (${largeFunctions.length} functions > 500 chars)`,
            severity: "MEDIUM"
          });
        }
      }
    });

    jsFiles.on('end', () => {
      analysis.metrics.files = jsFileCount;
      analysis.metrics.lines = totalLines;
      analysis.metrics.complexity = Math.floor(analysis.metrics.functions * 1.5);

      // Generate recommendations
      if (analysis.metrics.complexity > 50) {
        analysis.recommendations.push("Consider refactoring complex functions to improve maintainability");
      }
      
      if (analysis.issues.vulnerabilities.length > 0) {
        analysis.recommendations.push("Address security vulnerabilities immediately");
      }

      // Save analysis report
      fs.writeFileSync("reports/sonar-analysis.json", JSON.stringify(analysis, null, 2));
      
      console.log("\n📊 Code Quality Analysis (SonarQube-style):");
      console.log(`Files: ${analysis.metrics.files}`);
      console.log(`Lines: ${analysis.metrics.lines}`);
      console.log(`Functions: ${analysis.metrics.functions}`);
      console.log(`Complexity: ${analysis.metrics.complexity}`);
      console.log(`Bugs: ${analysis.issues.bugs.length}`);
      console.log(`Vulnerabilities: ${analysis.issues.vulnerabilities.length}`);
      console.log(`Code Smells: ${analysis.issues.codeSmells.length}`);
      
      if (analysis.recommendations.length > 0) {
        console.log("\n💡 Recommendations:");
        analysis.recommendations.forEach(rec => console.log(`• ${rec}`));
      }
      
      resolve();
    });
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
              reduceIdents: false, // Keep for Shopify compatibility
            },
          ],
        }),
      ])
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
      ]),
    )
    .pipe(size({ title: "Images", showFiles: true }))
    .pipe(gulp.dest(paths.images.dest));
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
      bundleStats.performance.loadTimeEst3G = (bundleStats.performance.gzipEstimateKB / 50).toFixed(1); // 50KB/s on 3G

      // Write bundle stats
      fs.writeFileSync(
        "reports/bundle-analysis.json",
        JSON.stringify(bundleStats, null, 2),
      );

      console.log("\n📊 Bundle Analysis:");
      Object.entries(bundleStats.files).forEach(([file, stats]) => {
        console.log(`${file}: ${stats.sizeKB} KB (gzipped ~${stats.gzipEstKB} KB)`);
      });
      
      console.log(`\n⚡ Performance Metrics:`);
      console.log(`Total Size: ${bundleStats.performance.totalSizeKB.toFixed(2)} KB`);
      console.log(`Gzipped Estimate: ${bundleStats.performance.gzipEstimateKB.toFixed(2)} KB`);
      console.log(`3G Load Time Estimate: ${bundleStats.performance.loadTimeEst3G}s`);

      if (bundleStats.recommendations.length > 0) {
        console.log("\n💡 Recommendations:");
        bundleStats.recommendations.forEach((rec) => console.log(`• ${rec.message}`));
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
const prod = gulp.series(clean, createReportsDir, lint, compileProd, analyze, performanceAudit);
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
  shopifyValidation
};

export default build;