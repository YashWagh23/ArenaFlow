const fs = require('fs');
const content = fs.readFileSync('lighthouse-report.html', 'utf-8');
const match = content.match(/window\.__LIGHTHOUSE_JSON__ = (.*?);<\/script>/);
if (match) {
  const data = JSON.parse(match[1]);
  const c = data.categories;
  console.log(`Perf: ${c.performance.score * 100}, A11y: ${c.accessibility.score * 100}, BP: ${c['best-practices'].score * 100}, SEO: ${c.seo.score * 100}`);
  
  const audits = data.audits;
  Object.values(audits)
    .filter(a => a.score !== null && a.score < 1 && a.details && a.details.type === 'opportunity')
    .forEach(a => console.log(a.title, a.displayValue));
}
