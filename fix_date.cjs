const fs = require('fs');
const execSync = require('child_process').execSync;
const date = execSync('git log -1 --format=%cs').toString().trim();
const content = fs.readFileSync('src/content/docs/blog/philosophy.md', 'utf8');
const newContent = content.replace(/^date: .*$/m, `date: ${date}`);
fs.writeFileSync('src/content/docs/blog/philosophy.md', newContent);

const content2 = fs.readFileSync('src/content/docs/blog/feasibility-review-framework.md', 'utf8');
const newContent2 = content2.replace(/^date: .*$/m, `date: ${date}`);
fs.writeFileSync('src/content/docs/blog/feasibility-review-framework.md', newContent2);
