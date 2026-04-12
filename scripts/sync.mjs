import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';

const WORK_DIR = process.cwd();
const LOCAL_SEOCHO_REPO_DIR =
    process.env.SEOCHO_SOURCE_REPO ||
    path.resolve(WORK_DIR, '..');
const USE_LOCAL_SOURCE =
    fs.existsSync(path.join(LOCAL_SEOCHO_REPO_DIR, 'README.md')) &&
    fs.existsSync(path.join(LOCAL_SEOCHO_REPO_DIR, 'docs'));
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'seocho-site-sync-'));
const SEOCHO_REPO_DIR = USE_LOCAL_SOURCE
    ? LOCAL_SEOCHO_REPO_DIR
    : path.join(TEMP_ROOT, 'seocho');
const TARGET_DOCS_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'docs');
const TARGET_BLOG_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'blog');
const UPDATES_JSON_PATH = path.join(WORK_DIR, 'src', 'data', 'updates.json');

// Ensure target directories exist
if (!fs.existsSync(TARGET_DOCS_DIR)) {
    fs.mkdirSync(TARGET_DOCS_DIR, { recursive: true });
}
if (!fs.existsSync(TARGET_BLOG_DIR)) {
    fs.mkdirSync(TARGET_BLOG_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(UPDATES_JSON_PATH))) {
    fs.mkdirSync(path.dirname(UPDATES_JSON_PATH), { recursive: true });
}

// 1. Fetching external repository (Shallow clone to save time)
if (USE_LOCAL_SOURCE) {
    console.log(`Using local seocho source at ${SEOCHO_REPO_DIR}`);
} else {
    console.log('Cloning tteon/seocho to extract docs...');
    execSync(`git clone --depth 1 https://github.com/tteon/seocho.git ${SEOCHO_REPO_DIR}`);
}

function sourceDateFor(relPath) {
    try {
        const output = execSync(
            `git -C "${SEOCHO_REPO_DIR}" log -1 --format=%cs -- "${relPath}"`,
            { stdio: ['ignore', 'pipe', 'ignore'] }
        ).toString().trim();
        return output || new Date().toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

// 2. Mapping Files to copy over to Starlight
const fileMappings = [
    {
        src: 'docs/README.md',
        dest: 'index.md',
        frontmatter: `---\ntitle: Docs Home\ndescription: Central Documentation Index for SEOCHO\n---\n\n> *Source mirrored from \`seocho/docs/README.md\`*\n\n`
    },
    {
        src: 'docs/QUICKSTART.md',
        dest: 'quickstart.md',
        frontmatter: `---\ntitle: Quickstart\ndescription: Get SEOCHO up and running in 5 minutes.\n---\n\n> *Source mirrored from \`seocho/docs/QUICKSTART.md\`*\n\n`
    },
    {
        src: 'docs/APPLY_YOUR_DATA.md',
        dest: 'apply_your_data.md',
        frontmatter: `---\ntitle: Bring Your Data\ndescription: How to load your own records into SEOCHO and query them safely.\n---\n\n> *Source mirrored from \`seocho/docs/APPLY_YOUR_DATA.md\`*\n\n`
    },
    {
        src: 'docs/PYTHON_INTERFACE_QUICKSTART.md',
        dest: 'python_sdk.md',
        frontmatter: `---\ntitle: Python SDK\ndescription: Developer-first guide to ingest data and query SEOCHO through the Python SDK.\n---\n\n> *Source mirrored from \`seocho/docs/PYTHON_INTERFACE_QUICKSTART.md\`*\n\n`
    },
    {
        src: 'docs/FILES_AND_ARTIFACTS.md',
        dest: 'files_and_artifacts.md',
        frontmatter: `---\ntitle: Files and Artifacts\ndescription: Where ontology files, graph state, rule profiles, semantic artifacts, and traces live.\n---\n\n> *Source mirrored from \`seocho/docs/FILES_AND_ARTIFACTS.md\`*\n\n`
    },
    {
        src: 'docs/ARCHITECTURE.md',
        dest: 'architecture.md',
        frontmatter: `---\ntitle: Architecture\ndescription: System Architecture and Module Map.\n---\n\n> *Source mirrored from \`seocho/docs/ARCHITECTURE.md\`*\n\n`
    },
    {
        src: 'docs/WORKFLOW.md',
        dest: 'workflow.md',
        isBlog: false,
        frontmatter: `---\ntitle: Workflow\ndescription: End-to-end Operational Workflow.\n---\n\n> *Source mirrored from \`seocho/docs/WORKFLOW.md\`*\n\n`
    },
    {
        src: 'docs/PHILOSOPHY.md',
        dest: 'philosophy.md',
        isBlog: true,
        frontmatter: `---\ntitle: "SEOCHO Design Philosophy & Operating Principles"\ndate: ${sourceDateFor('docs/PHILOSOPHY.md')}\nauthors:\n  - seocho\nexcerpt: Extract domain rules and high-value semantics from heterogeneous data into a SHACL-like semantic layer.\n---\n\n> *Source mirrored from \`seocho/docs/PHILOSOPHY.md\`*\n\n`
    },
    {
        src: 'docs/PHILOSOPHY_FEASIBILITY_REVIEW.md',
        dest: 'feasibility-review-framework.md',
        isBlog: true,
        frontmatter: `---\ntitle: "Feasibility Review Framework & Rubrics"\ndate: ${sourceDateFor('docs/PHILOSOPHY_FEASIBILITY_REVIEW.md')}\nauthors:\n  - seocho\nexcerpt: Multi-role feasibility review framework and Go/No-Go rubric for graph data implementations.\n---\n\n> *Source mirrored from \`seocho/docs/PHILOSOPHY_FEASIBILITY_REVIEW.md\`*\n\n`
    }
];

const routeReplacements = new Map([
    ['`docs/README.md`', '[`/docs/`](/docs/)'],
    ['`docs/QUICKSTART.md`', '[`/docs/quickstart/`](/docs/quickstart/)'],
    ['`docs/APPLY_YOUR_DATA.md`', '[`/docs/apply_your_data/`](/docs/apply_your_data/)'],
    ['`docs/PYTHON_INTERFACE_QUICKSTART.md`', '[`/docs/python_sdk/`](/docs/python_sdk/)'],
    ['`docs/FILES_AND_ARTIFACTS.md`', '[`/docs/files_and_artifacts/`](/docs/files_and_artifacts/)'],
    ['`docs/ARCHITECTURE.md`', '[`/docs/architecture/`](/docs/architecture/)'],
    ['`docs/WORKFLOW.md`', '[`/docs/workflow/`](/docs/workflow/)'],
    ['`docs/PHILOSOPHY.md`', '[`/docs/philosophy/`](/docs/philosophy/)'],
    ['`docs/TUTORIAL_FIRST_RUN.md`', '[`/docs/tutorial/`](/docs/tutorial/)'],
    ['`docs/OPEN_SOURCE_PLAYBOOK.md`', '[`/docs/open_source_playbook/`](/docs/open_source_playbook/)'],
]);

function rewriteWebsiteRoutes(content) {
    let rewritten = content;
    for (const [sourceRef, routeLink] of routeReplacements.entries()) {
        rewritten = rewritten.replaceAll(sourceRef, routeLink);
    }
    return rewritten;
}

// Copy and inject frontmatter
console.log('Processing and wrapping markdown files...');
for (const map of fileMappings) {
    const sourcePath = path.join(SEOCHO_REPO_DIR, map.src);
    const destDir = map.isBlog ? TARGET_BLOG_DIR : TARGET_DOCS_DIR;
    const destPath = path.join(destDir, map.dest);

    if (fs.existsSync(sourcePath)) {
        let content = fs.readFileSync(sourcePath, 'utf8');

        // Attempt to remove existing H1 titles so it doesn't clash with Astro Title
        content = content.replace(/^#\s(.*?)\n/m, '');
        content = rewriteWebsiteRoutes(content);

        fs.writeFileSync(destPath, map.frontmatter + content);
        console.log(`✅ Synced: ${map.src} -> ${path.join(path.basename(destDir), map.dest)}`);
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
if (!USE_LOCAL_SOURCE) {
    fs.rmSync(TEMP_ROOT, { recursive: true, force: true });
}
console.log('🎉 Sync complete!');
