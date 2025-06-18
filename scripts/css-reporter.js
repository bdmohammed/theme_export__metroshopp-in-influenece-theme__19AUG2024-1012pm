// scripts/css-reporter.js
const fs = require("fs");
const path = require("path");
const stylelintFormatter = require("stylelint-html-reporter");

module.exports = function (results) {
  const reportPath = path.join(__dirname, "../reports/css-lint-report.html");
  const htmlReport = stylelintFormatter({
    results,
    outputFile: reportPath,
  });

  fs.writeFileSync(reportPath, htmlReport);
  console.log(`CSS lint report generated: ${reportPath}`);
};
