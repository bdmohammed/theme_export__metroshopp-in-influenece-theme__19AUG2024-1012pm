const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
const imageminGifsicle = require("imagemin-gifsicle");
const { deleteAsync } = require("del");
const fs = require("fs");
const path = require("path");
const gulpStylelint = require("gulp-stylelint");
const size = require("gulp-size");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const zip = require("gulp-zip");
const through2 = require("through2");

// Paths configuration
const paths = {
  styles: {
    src: ["src/css/**/*.css", "assets/**/*.css", "!assets/*.min.css"],
    dest: "assets/",
    watch: ["src/css/**/*.css", "assets/**/*.css", "!assets/*.min.css"],
  },
  scripts: {
    src: ["src/js/**/*.js", "assets/**/*.js", "!assets/*.min.js"],
    dest: "assets/",
    watch: ["src/js/**/*.js", "assets/**/*.js", "!assets/*.min.js"],
  },
  images: {
    src: "src/images/**/*",
    dest: "assets/",
    watch: "src/images/**/*",
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
  ]);
}

// Create reports directory
function createReportsDir() {
  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }
  return Promise.resolve();
}

// Lint JavaScript
// function lintJS() {
//   return gulp.src([...paths.scripts.src, '!node_modules/**'])
//     .pipe(plumber({ errorHandler: onError }))
//     .pipe(gulpEslint())
//     .pipe(gulpEslint.format())
//     .pipe(gulpEslint.format('html', fs.createWriteStream('reports/js-lint-report.html')))
//     .pipe(gulpEslint.failAfterError());
// }

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
      }),
    );
}

// Lint Liquid templates
// function lintLiquid() {
//   return gulp.src(paths.liquid.src)
//     .pipe(plumber({ errorHandler: onError }))
//     .pipe(htmlhint({
//       'tagname-lowercase': true,
//       'attr-lowercase': true,
//       'attr-value-double-quotes': true,
//       'doctype-first': false,
//       'tag-pair': true,
//       'spec-char-escape': true,
//       'id-unique': true,
//       'src-not-empty': true,
//       'attr-no-duplication': true,
//       'title-require': false,
//       'alt-require': true
//     }))
//     .pipe(htmlhint.reporter())
//     .pipe(htmlhint.reporter('htmlhint-stylish'));
// }

// Format code with Prettier
// function formatCode() {
//   return gulp.src([
//     'src/**/*.{js,css}',
//     'assets/**/*.{js,css}',
//     '!assets/*.min.{js,css}',
//     'templates/**/*.liquid',
//     'sections/**/*.liquid',
//     'snippets/**/*.liquid',
//     'layout/**/*.liquid'
//   ])
//     .pipe(gulpPrettier())
//     .pipe(gulp.dest(file => file.base));
// }

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
        cssnano({
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifySelectors: true,
              minifyParams: true,
            },
          ],
        }),
      ]),
    )
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(size({ title: "CSS (uncompressed)", showFiles: true }))
    .pipe(
      cleanCSS({
        level: 2,
        compatibility: "ie10",
        format: "beautify",
      }),
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
          unsafe_comps: false,
          unsafe_math: false,
          unsafe_proto: false,
          unsafe_regexp: false,
          unsafe_undefined: false,
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
        imageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
        imageminPngquant({
          quality: [0.65, 0.85],
          strip: true,
        }),
        imageminSvgo({
          plugins: [
            { name: "removeViewBox", active: false },
            { name: "cleanupIDs", active: false },
            { name: "removeUselessStrokeAndFill", active: true },
            { name: "removeEmptyAttrs", active: true },
            { name: "removeComments", active: true },
            { name: "removeMetadata", active: true },
          ],
        }),
        imageminGifsicle({
          interlaced: true,
          optimizationLevel: 3,
        }),
      ]),
    )
    .pipe(size({ title: "Images", showFiles: true }))
    .pipe(gulp.dest(paths.images.dest));
}

// Code quality analysis
function analyzeCode() {
  const bundleStats = {
    timestamp: new Date().toISOString(),
    files: {},
    recommendations: [],
  };

  return gulp
    .src(["assets/*.min.js", "assets/*.min.css"])
    .pipe(
      through2.obj(function (file, _, cb) {
        const fileName = path.basename(file.path);
        const size = file.contents.length;
        const sizeKB = (size / 1024).toFixed(2);

        bundleStats.files[fileName] = {
          size: size,
          sizeKB: sizeKB,
        };

        // Add recommendations based on file size
        if (fileName.includes(".js") && size > 100000) {
          bundleStats.recommendations.push(
            `⚠️  ${fileName} (${sizeKB}KB) is large. Consider code splitting or removing unused code.`,
          );
        }
        if (fileName.includes(".css") && size > 50000) {
          bundleStats.recommendations.push(
            `⚠️  ${fileName} (${sizeKB}KB) is large. Consider removing unused CSS or splitting into multiple files.`,
          );
        }

        this.push(file);
        cb();
      }),
    )
    .on("end", () => {
      // Write bundle stats
      fs.writeFileSync(
        "reports/bundle-stats.json",
        JSON.stringify(bundleStats, null, 2),
      );

      console.log("\n📊 Bundle Analysis:");
      Object.entries(bundleStats.files).forEach(([file, stats]) => {
        console.log(`${file}: ${stats.sizeKB} KB`);
      });

      if (bundleStats.recommendations.length > 0) {
        console.log("\n💡 Recommendations:");
        bundleStats.recommendations.forEach((rec) => console.log(rec));
      }
    });
}

// Performance audit for Shopify themes
function performanceAudit() {
  console.log("\n🚀 Shopify Theme Performance Checklist:");
  console.log("✅ CSS and JS are minified and compressed");
  console.log("✅ Images are optimized with proper compression");
  console.log("✅ Autoprefixer applied for browser compatibility");
  console.log("✅ Source maps generated for debugging");
  console.log("\n💡 Additional Performance Tips:");
  console.log("• Use {% liquid %} tags for better performance");
  console.log('• Lazy load images with loading="lazy" attribute');
  console.log("• Minimize DOM manipulation in JavaScript");
  console.log("• Use Shopify's image filters for responsive images");
  console.log("• Preload critical fonts and resources");
  console.log("• Consider using Shopify's Script Tag API for heavy JS");
  console.log("• Optimize Liquid loops and avoid nested loops");
  console.log(
    "• Use {% render %} instead of {% include %} for better performance",
  );

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
      "!.htmlhintrc*",
    ])
    .pipe(zip(`theme-${new Date().toISOString().split("T")[0]}.zip`))
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
const quality = gulp.series(createReportsDir, lint, formatCode, analyzeCode);
const optimize = gulp.series(compile, analyzeCode);

// Main tasks
const build = gulp.series(clean, createReportsDir, lint, compile, analyzeCode);
const prod = gulp.series(
  clean,
  createReportsDir,
  lint,
  compileProd,
  analyzeCode,
  performanceAudit,
);
const dev = gulp.series(build, watchFiles);
const audit = gulp.series(build, performanceAudit, shopifyValidation);
const ship = gulp.series(prod, packageTheme);

// Export all tasks
exports.clean = clean;
exports.lint = lint;
exports["lint:js"] = lintJS;
exports["lint:css"] = lintCSS;
exports["lint:liquid"] = lintLiquid;
exports.format = formatCode;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.quality = quality;
exports.optimize = optimize;
exports.build = build;
exports.prod = prod;
exports.dev = dev;
exports.watch = watchFiles;
exports.audit = audit;
exports.package = packageTheme;
exports.ship = ship;
exports.default = build;
