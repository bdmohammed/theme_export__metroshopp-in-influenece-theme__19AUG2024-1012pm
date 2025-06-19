// scripts/css-reporter.js
import fs from "fs";
import path from "path";
import stylelintFormatter from "stylelint-html-reporter";

export default function (results) {
  const reportPath = path.join(__dirname, "../reports/css-lint-report.html");
  const htmlReport = stylelintFormatter({
    results,
    outputFile: reportPath,
  });

  fs.writeFileSync(reportPath, htmlReport);
  console.log(`CSS lint report generated: ${reportPath}`);
}
