// quality-analyzer.js - Advanced Shopify Theme Quality Analyzer
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class ShopifyQualityAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      score: 0,
      categories: {
        performance: { score: 0, issues: [], recommendations: [] },
        accessibility: { score: 0, issues: [], recommendations: [] },
        seo: { score: 0, issues: [], recommendations: [] },
        bestPractices: { score: 0, issues: [], recommendations: [] },
        codeQuality: { score: 0, issues: [], recommendations: [] }
      }
    };
  }

  // Analyze theme structure
  analyzeThemeStructure() {
    const requiredFiles = [
      'layout/theme.liquid',
      'templates/index.liquid',
      'templates/product.liquid',
      'templates/collection.liquid',
      'config/settings_schema.json',
      'locales/en.default.json'
    ];

    const optionalButRecommended = [
      'templates/cart.liquid',
      'templates/search.liquid',
      'templates/404.liquid',
      'sections/header.liquid',
      'sections/footer.liquid',
      'snippets/product-card.liquid'
    ];

    let structureScore = 100;

    requiredFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        this.results.categories.bestPractices.issues.push(`Missing required file: ${file}`);
        structureScore -= 15;
      }
    });

    optionalButRecommended.forEach(file => {
      if (!fs.existsSync(file)) {
        this.results.categories.bestPractices.recommendations.push(`Consider adding: ${file}`);
        structureScore -= 5;
      }
    });

    this.results.categories.bestPractices.score = Math.max(0, structureScore);
  }

  // Analyze Liquid templates
  analyzeLiquidTemplates() {
    const liquidFiles = this.findFiles(['templates', 'sections', 'snippets', 'layout'], '.liquid');
    let liquidScore = 100;

    liquidFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for performance issues
      if (content.includes('{% for') && !content.includes('{% break %}')) {
        if (content.match(/{% for.*%}/g)?.length > 3) {
          this.results.categories.performance.issues.push(`${file}: Multiple nested loops detected`);
          liquidScore -= 10;
        }
      }

      // Check for accessibility
      if (content.includes('<img') && !content.includes('alt=')) {
        this.results.categories.accessibility.issues.push(`${file}: Images without alt attributes`);
        liquidScore -= 5;
      }

      // Check for SEO
      if (file.includes('layout/theme.liquid')) {
        if (!content.includes('canonical_url')) {
          this.results.categories.seo.issues.push('Missing canonical URL in theme.liquid');
          liquidScore -= 10;
        }
        if (!content.includes('page_description')) {
          this.results.categories.seo.issues.push('Missing meta description in theme.liquid');
          liquidScore -= 10;
        }
      }

      // Check for deprecated Liquid tags
      const deprecatedTags = ['{% include', '{{ article.content }}'];
      deprecatedTags.forEach(tag => {
        if (content.includes(tag)) {
          this.results.categories.codeQuality.issues.push(`${file}: Uses deprecated tag ${tag}`);
          liquidScore -= 5;
        }
      });

      // Check for inline styles
      if (content.includes('style=')) {
        this.results.categories.bestPractices.issues.push(`${file}: Contains inline styles`);
        liquidScore -= 3;
      }
    });

    this.results.categories.codeQuality.score = Math.max(0, liquidScore);
  }

  // Analyze CSS/SCSS
  analyzeStyles() {
    const styleFiles = this.findFiles(['src/scss', 'assets'], ['.css', '.scss']);
    let styleScore = 100;

    styleFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for !important overuse
      const importantCount = (content.match(/!important/g) || []).length;
      if (importantCount > 10) {
        this.results.categories.codeQuality.issues.push(`${file}: Excessive use of !important (${importantCount})`);
        styleScore -= 10;
      }

      // Check for mobile-first approach
      if (!content.includes('@media') && content.length > 1000) {
        this.results.categories.performance.recommendations.push(`${file}: Consider mobile-first responsive design`);
        styleScore -= 5;
      }

      // Check for vendor prefixes (should be auto-prefixed)
      const vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
      vendorPrefixes.forEach(prefix => {
        if (content.includes(prefix)) {
          this.results.categories.bestPractices.recommendations.push(`${file}: Manual vendor prefixes detected (use autoprefixer)`);
        }
      });

      // Check for unused selectors (basic check)
      const selectors = content.match(/\.[a-zA-Z][\w-]*/g) || [];
      if (selectors.length > 500) {
        this.results.categories.performance.recommendations.push(`${file}: Large number of selectors (${selectors.length}), consider CSS purging`);
      }
    });

    this.results.categories.performance.score = Math.max(0, styleScore);
  }

  // Analyze JavaScript
  analyzeScripts() {
    const scriptFiles = this.findFiles(['src/js', 'assets'], '.js');
    let scriptScore = 100;

    scriptFiles.forEach(file => {
      if (file.includes('.min.js')) return; // Skip minified files
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for console statements
      const consoleCount = (content.match(/console\./g) || []).length;
      if (consoleCount > 5) {
        this.results.categories.codeQuality.issues.push(`${file}: Contains ${consoleCount} console statements`);
        scriptScore -= 5;
      }

      // Check for jQuery usage (performance concern)
      if (content.includes(') || content.includes('jQuery')) {
        this.results.categories.performance.recommendations.push(`${file}: Consider vanilla JS for better performance`);
      }

      // Check for async/await vs callbacks
      if (content.includes('callback') && !content.includes('async')) {
        this.results.categories.bestPractices.recommendations.push(`${file}: Consider using async/await instead of callbacks`);
      }

      // Check for event listeners cleanup
      if (content.includes('addEventListener') && !content.includes('removeEventListener')) {
        this.results.categories.performance.recommendations.push(`${file}: Add event listener cleanup to prevent memory leaks`);
      }
    });

    this.results.categories.codeQuality.score = Math.max(0, scriptScore);
  }

  // Analyze image optimization
  analyzeImages() {
    const imageFiles = this.findFiles(['assets', 'src/images'], ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']);
    let imageScore = 100;

    imageFiles.forEach(file => {
      const stats = fs.statSync(file);
      const fileSizeKB = stats.size / 1024;

      // Check image sizes
      if (file.match(/\.(jpg|jpeg|png)$/i) && fileSizeKB > 500) {
        this.results.categories.performance.issues.push(`${file}: Large image file (${fileSizeKB.toFixed(1)}KB)`);
        imageScore -= 10;
      }

      // Check for WebP alternatives
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const webpVersion = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        if (!fs.existsSync(webpVersion)) {
          this.results.categories.performance.recommendations.push(`Consider WebP version for ${file}`);
        }
      }
    });

    // Check for responsive images usage
    const liquidFiles = this.findFiles(['templates', 'sections', 'snippets'], '.liquid');
    let hasResponsiveImages = false;
    
    liquidFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('image_url') && content.includes('srcset')) {
        hasResponsiveImages = true;
      }
    });

    if (!hasResponsiveImages) {
      this.results.categories.performance.recommendations.push('Implement responsive images with srcset');
      imageScore -= 15;
    }

    this.results.categories.performance.score = Math.max(0, Math.min(this.results.categories.performance.score, imageScore));
  }

  // Check Shopify best practices
  checkShopifyBestPractices() {
    let shopifyScore = 100;

    // Check for theme settings
    const settingsSchema = 'config/settings_schema.json';
    if (fs.existsSync(settingsSchema)) {
      const settings = JSON.parse(fs.readFileSync(settingsSchema, 'utf8'));
      
      if (!Array.isArray(settings) || settings.length === 0) {
        this.results.categories.bestPractices.issues.push('Empty or invalid settings_schema.json');
        shopifyScore -= 20;
      }

      // Check for color and typography settings
      const hasColorSettings = JSON.stringify(settings).includes('"type": "color"');
      const hasTypographySettings = JSON.stringify(settings).includes('font');
      
      if (!hasColorSettings) {
        this.results.categories.bestPractices.recommendations.push('Add color customization settings');
      }
      if (!hasTypographySettings) {
        this.results.categories.bestPractices.recommendations.push('Add typography settings');
      }
    }

    // Check for section settings
    const sectionFiles = this.findFiles(['sections'], '.liquid');
    sectionFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes('{% schema %}')) {
        this.results.categories.bestPractices.issues.push(`${file}: Missing schema settings`);
        shopifyScore -= 10;
      }
    });

    // Check for localization
    const localesDir = 'locales';
    if (!fs.existsSync(localesDir) || fs.readdirSync(localesDir).length === 0) {
      this.results.categories.seo.issues.push('Missing localization files');
      shopifyScore -= 15;
    }

    this.results.categories.bestPractices.score = Math.max(0, Math.min(this.results.categories.bestPractices.score, shopifyScore));
  }

  // Security analysis
  analyzeCodeSecurity() {
    const allFiles = [
      ...this.findFiles(['templates', 'sections', 'snippets', 'layout'], '.liquid'),
      ...this.findFiles(['src/js', 'assets'], '.js')
    ];

    let securityScore = 100;

    allFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for potential XSS vulnerabilities
      if (file.endsWith('.liquid')) {
        // Look for unescaped output
        const unescapedOutputs = content.match(/\{\{\s*[^}]*\s*\}\}/g) || [];
        unescapedOutputs.forEach(output => {
          if (!output.includes('| escape') && !output.includes('| strip_html')) {
            this.results.categories.codeQuality.recommendations.push(`${file}: Consider escaping output: ${output.trim()}`);
          }
        });
      }

      // Check for hardcoded credentials or keys
      const sensitivePatterns = [
        /api[_-]?key/i,
        /secret/i,
        /password/i,
        /token/i
      ];

      sensitivePatterns.forEach(pattern => {
        if (pattern.test(content)) {
          this.results.categories.codeQuality.issues.push(`${file}: Potential sensitive data found`);
          securityScore -= 20;
        }
      });
    });

    this.results.categories.codeQuality.score = Math.max(0, Math.min(this.results.categories.codeQuality.score, securityScore));
  }

  // Accessibility analysis
  analyzeAccessibility() {
    const liquidFiles = this.findFiles(['templates', 'sections', 'snippets', 'layout'], '.liquid');
    let a11yScore = 100;

    liquidFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for missing alt attributes
      const images = content.match(/<img[^>]*>/g) || [];
      images.forEach(img => {
        if (!img.includes('alt=')) {
          this.results.categories.accessibility.issues.push(`${file}: Image without alt attribute`);
          a11yScore -= 5;
        }
      });

      // Check for proper heading hierarchy
      const headings = content.match(/<h[1-6][^>]*>/g) || [];
      if (headings.length > 0) {
        // Basic check for h1 presence
        if (!content.includes('<h1')) {
          this.results.categories.accessibility.recommendations.push(`${file}: Consider adding h1 heading`);
        }
      }

      // Check for form labels
      const inputs = content.match(/<input[^>]*>/g) || [];
      inputs.forEach(input => {
        if (!input.includes('aria-label') && !content.includes('<label')) {
          this.results.categories.accessibility.issues.push(`${file}: Form input without label or aria-label`);
          a11yScore -= 5;
        }
      });

      // Check for color contrast indicators
      if (!content.includes('aria-') && content.includes('color')) {
        this.results.categories.accessibility.recommendations.push(`${file}: Consider adding ARIA attributes for better accessibility`);
      }
    });

    this.results.categories.accessibility.score = Math.max(0, a11yScore);
  }

  // SEO analysis
  analyzeSEO() {
    let seoScore = 100;

    // Check theme.liquid for SEO elements
    const themeFile = 'layout/theme.liquid';
    if (fs.existsSync(themeFile)) {
      const content = fs.readFileSync(themeFile, 'utf8');
      
      const requiredSEOElements = [
        { element: 'canonical_url', penalty: 15 },
        { element: 'page_title', penalty: 10 },
        { element: 'page_description', penalty: 10 },
        { element: 'og:', penalty: 5 },
        { element: 'twitter:', penalty: 5 }
      ];

      requiredSEOElements.forEach(({ element, penalty }) => {
        if (!content.includes(element)) {
          this.results.categories.seo.issues.push(`Missing ${element} in theme.liquid`);
          seoScore -= penalty;
        }
      });

      // Check for structured data
      if (!content.includes('application/ld+json')) {
        this.results.categories.seo.recommendations.push('Add structured data (JSON-LD) for better SEO');
        seoScore -= 10;
      }
    }

    // Check for proper URL structure in templates
    const templateFiles = this.findFiles(['templates'], '.liquid');
    templateFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('{{ product.url }}') && !content.includes('| within:')) {
        this.results.categories.seo.recommendations.push(`${file}: Consider using collection context for product URLs`);
      }
    });

    this.results.categories.seo.score = Math.max(0, seoScore);
  }

  // Find files helper
  findFiles(directories, extensions) {
    const files = [];
    const exts = Array.isArray(extensions) ? extensions : [extensions];

    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const walk = (currentDir) => {
          const items = fs.readdirSync(currentDir);
          items.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              walk(fullPath);
            } else if (exts.some(ext => item.endsWith(ext))) {
              files.push(fullPath);
            }
          });
        };
        walk(dir);
      }
    });

    return files;
  }

  // Calculate overall score
  calculateOverallScore() {
    const scores = Object.values(this.results.categories).map(cat => cat.score);
    this.results.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  // Generate recommendations
  generateRecommendations() {
    const recommendations = [];

    // Performance recommendations
    if (this.results.categories.performance.score < 80) {
      recommendations.push('🚀 Performance: Optimize images, implement lazy loading, and consider using WebP format');
    }

    // Accessibility recommendations
    if (this.results.categories.accessibility.score < 80) {
      recommendations.push('♿ Accessibility: Add alt attributes to images, proper form labels, and ARIA attributes');
    }

    // SEO recommendations  
    if (this.results.categories.seo.score < 80) {
      recommendations.push('🔍 SEO: Add structured data, optimize meta tags, and implement proper URL structure');
    }

    // Code quality recommendations
    if (this.results.categories.codeQuality.score < 80) {
      recommendations.push('🔧 Code Quality: Remove console statements, escape Liquid output, and update deprecated tags');
    }

    // Best practices recommendations
    if (this.results.categories.bestPractices.score < 80) {
      recommendations.push('✅ Best Practices: Add theme settings, implement proper section schemas, and follow Shopify guidelines');
    }

    return recommendations;
  }

  // Run full analysis
  async runAnalysis() {
    console.log('🔍 Starting Shopify Theme Quality Analysis...\n');

    this.analyzeThemeStructure();
    console.log('✅ Theme structure analyzed');

    this.analyzeLiquidTemplates();
    console.log('✅ Liquid templates analyzed');

    this.analyzeStyles();
    console.log('✅ Styles analyzed');

    this.analyzeScripts();
    console.log('✅ Scripts analyzed');

    this.analyzeImages();
    console.log('✅ Images analyzed');

    this.checkShopifyBestPractices();
    console.log('✅ Shopify best practices checked');

    this.analyzeCodeSecurity();
    console.log('✅ Security analysis completed');

    this.analyzeAccessibility();
    console.log('✅ Accessibility analysis completed');

    this.analyzeSEO();
    console.log('✅ SEO analysis completed');

    this.calculateOverallScore();

    // Generate report
    this.generateReport();
  }

  // Generate comprehensive report
  generateReport() {
    const report = {
      ...this.results,
      recommendations: this.generateRecommendations()
    };

    // Save JSON report
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports');
    }
    
    fs.writeFileSync('reports/quality-report.json', JSON.stringify(report, null, 2));

    // Generate HTML report
    this.generateHTMLReport(report);

    // Console output
    console.log('\n📊 SHOPIFY THEME QUALITY REPORT');
    console.log('=====================================');
    console.log(`Overall Score: ${report.score}/100`);
    console.log(`Grade: ${this.getGrade(report.score)}`);
    console.log('\nCategory Scores:');
    Object.entries(report.categories).forEach(([category, data]) => {
      console.log(`  ${category}: ${data.score}/100`);
    });

    console.log('\n🎯 Top Recommendations:');
    report.recommendations.forEach(rec => console.log(`  ${rec}`));

    console.log(`\n📄 Detailed report saved to: reports/quality-report.html`);
  }

  // Generate HTML report
  generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopify Theme Quality Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .score-circle { width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(#4ade80 ${report.score * 3.6}deg, #e5e7eb 0deg); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .score-inner { width: 90px; height: 90px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; color: #333; font-size: 24px; font-weight: bold; }
        .content { padding: 30px; }
        .category { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .category h3 { margin: 0 0 15px 0; color: #374151; }
        .progress-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-bottom: 15px; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
        .issues { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .recommendations { background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .issue-item, .rec-item { margin: 5px 0; }
        .grade { font-size: 18px; font-weight: bold; }
        .grade-A { color: #16a34a; }
        .grade-B { color: #ca8a04; }
        .grade-C { color: #ea580c; }
        .grade-D { color: #dc2626; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="score-circle">
                <div class="score-inner">${report.score}</div>
            </div>
            <h1 style="text-align: center; margin: 0;">Shopify Theme Quality Report</h1>
            <p style="text-align: center; margin: 10px 0 0 0; opacity: 0.9;">Generated on ${new Date(report.timestamp).toLocaleDateString()}</p>
            <div class="grade" style="text-align: center; margin-top: 15px;">
                <span class="grade-${this.getGrade(report.score)}">Grade: ${this.getGrade(report.score)}</span>
            </div>
        </div>
        <div class="content">
            ${Object.entries(report.categories).map(([category, data]) => `
                <div class="category">
                    <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.score}%; background: ${this.getScoreColor(data.score)};"></div>
                    </div>
                    <p><strong>Score:</strong> ${data.score}/100</p>
                    ${data.issues.length > 0 ? `
                        <div class="issues">
                            <strong>Issues:</strong>
                            ${data.issues.map(issue => `<div class="issue-item">• ${issue}</div>`).join('')}
                        </div>
                    ` : ''}
                    ${data.recommendations.length > 0 ? `
                        <div class="recommendations">
                            <strong>Recommendations:</strong>
                            ${data.recommendations.map(rec => `<div class="rec-item">• ${rec}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
            
            <div class="category">
                <h3>📋 Action Items</h3>
                ${report.recommendations.map(rec => `<div class="rec-item">${rec}</div>`).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync('reports/quality-report.html', html);
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  }

  getScoreColor(score) {
    if (score >= 90) return '#16a34a';
    if (score >= 80) return '#ca8a04';
    if (score >= 70) return '#ea580c';
    return '#dc2626';
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new ShopifyQualityAnalyzer();
  analyzer.runAnalysis().catch(console.error);
}

module.exports = ShopifyQualityAnalyzer;