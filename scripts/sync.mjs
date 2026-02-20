import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SEOCHO_REPO_DIR = path.join(process.cwd(), 'temp_seocho');
const TARGET_DOCS_DIR = path.join(process.cwd(), 'src', 'content', 'docs', 'docs');
const UPDATES_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'updates.json');

// Ensure target directories exist
if (!fs.existsSync(TARGET_DOCS_DIR)) {
    fs.mkdirSync(TARGET_DOCS_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(UPDATES_JSON_PATH))) {
    fs.mkdirSync(path.dirname(UPDATES_JSON_PATH), { recursive: true });
}

// 1. Fetching external repository (Shallow clone to save time)
console.log('Cloning tteon/seocho to extract docs...');
if (fs.existsSync(SEOCHO_REPO_DIR)) {
    fs.rmSync(SEOCHO_REPO_DIR, { recursive: true, force: true });
}
execSync(`git clone --depth 1 https://github.com/tteon/seocho.git ${SEOCHO_REPO_DIR}`);

// 2. Mapping Files to copy over to Starlight
const fileMappings = [
    {
        src: 'docs/README.md',
        dest: 'index.md',
        frontmatter: `---\ntitle: Docs Home\ndescription: Central Documentation Index for SEOCHO\n---\n\n> *Synced automatically from \`seocho/docs/README.md\`*\n\n`
    },
    {
        src: 'docs/QUICKSTART.md',
        dest: 'quickstart.md',
        frontmatter: `---\ntitle: Quickstart\ndescription: Get SEOCHO up and running in 5 minutes.\n---\n\n> *Synced automatically from \`seocho/docs/QUICKSTART.md\`*\n\n`
    },
    {
        src: 'docs/ARCHITECTURE.md',
        dest: 'architecture.md',
        frontmatter: `---\ntitle: Architecture\ndescription: System Architecture and Module Map.\n---\n\n> *Synced automatically from \`seocho/docs/ARCHITECTURE.md\`*\n\n`
    },
    {
        src: 'docs/WORKFLOW.md',
        dest: 'workflow.md',
        frontmatter: `---\ntitle: Workflow\ndescription: End-to-end Operational Workflow.\n---\n\n> *Synced automatically from \`seocho/docs/WORKFLOW.md\`*\n\n`
    }
];

// Copy and inject frontmatter
console.log('Processing and wrapping markdown files...');
for (const map of fileMappings) {
    const sourcePath = path.join(SEOCHO_REPO_DIR, map.src);
    const destPath = path.join(TARGET_DOCS_DIR, map.dest);

    if (fs.existsSync(sourcePath)) {
        let content = fs.readFileSync(sourcePath, 'utf8');

        // Attempt to remove existing H1 titles so it doesn't clash with Astro Title
        content = content.replace(/^#\s(.*?)\n/m, '');

        fs.writeFileSync(destPath, map.frontmatter + content);
        console.log(`✅ Synced: ${map.src} -> ${map.dest}`);
    } else {
        console.warn(`⚠️ Warning: Source file not found ${map.src}`);
    }
}

// 3. Fetching Changelog via GitHub API
console.log('Fetching latest 5 releases from tteon/seocho for Changelog...');
try {
    const result = execSync(`curl -s https://api.github.com/repos/tteon/seocho/releases?per_page=5`);
    const releases = JSON.parse(result.toString());

    const updates = releases.map((release) => {
        // Format Date from ISO -> YYYY-MM-DD
        const dateStr = release.published_at ? release.published_at.split('T')[0] : 'Unknown';
        // Use tag name as pseudo-hash/identifier
        const hash = release.tag_name || 'v0.0.0';
        return {
            date: dateStr,
            message: release.name || release.tag_name,
            hash: hash,
            url: release.html_url,
            body: release.body
        };
    });

    if (updates.length > 0) {
        fs.writeFileSync(UPDATES_JSON_PATH, JSON.stringify(updates, null, 2));
        console.log(`✅ Synced ${updates.length} releases into updates.json`);
    } else {
        // Fallback if no releases exist yet
        console.log('⚠️ No releases found, generating fallback updates.json');
        fs.writeFileSync(UPDATES_JSON_PATH, JSON.stringify([{
            date: new Date().toISOString().split('T')[0],
            message: "Sync integration established. Awaiting first release.",
            hash: "init",
            url: "https://github.com/tteon/seocho/releases",
            body: "..."
        }], null, 2));
    }
} catch (error) {
    console.error('❌ Failed to fetch Github releases:', error.message);
}

// Cleanup Temporary clone
fs.rmSync(SEOCHO_REPO_DIR, { recursive: true, force: true });
console.log('🎉 Sync complete!');
