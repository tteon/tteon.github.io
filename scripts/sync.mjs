import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { createFileMappings, renderMirroredContent } from './docs-contract.mjs';

const WORK_DIR = process.cwd();
const EXPLICIT_SOURCE_REPO = process.env.SEOCHO_SOURCE_REPO;
const LOCAL_SEOCHO_REPO_DIR = EXPLICIT_SOURCE_REPO || path.resolve(WORK_DIR, '..');
const USE_LOCAL_SOURCE =
  Boolean(EXPLICIT_SOURCE_REPO) &&
  fs.existsSync(path.join(LOCAL_SEOCHO_REPO_DIR, 'README.md')) &&
  fs.existsSync(path.join(LOCAL_SEOCHO_REPO_DIR, 'docs'));
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'seocho-site-sync-'));
const SEOCHO_REPO_DIR = USE_LOCAL_SOURCE
  ? LOCAL_SEOCHO_REPO_DIR
  : path.join(TEMP_ROOT, 'seocho');
const TARGET_DOCS_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'docs');
const TARGET_BLOG_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'blog');
const UPDATES_JSON_PATH = path.join(WORK_DIR, 'src', 'data', 'updates.json');

if (USE_LOCAL_SOURCE) {
  console.log(`Using explicit SEOCHO source at ${SEOCHO_REPO_DIR}`);
} else {
  console.log('Cloning tteon/seocho to extract docs...');
  execSync(`git clone --filter=blob:none https://github.com/tteon/seocho.git ${SEOCHO_REPO_DIR}`, {
    stdio: 'inherit',
  });
}

function gitOutput(args, fallback = '') {
  try {
    return execSync(`git -C "${SEOCHO_REPO_DIR}" ${args}`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim() || fallback;
  } catch {
    return fallback;
  }
}

function sourceDateFor(relPath) {
  return gitOutput(`log -1 --format=%cs -- "${relPath}"`, new Date().toISOString().split('T')[0]);
}

function sourceCommitForRepo() {
  return gitOutput('rev-parse HEAD', 'unknown');
}

function cleanGeneratedOutputs() {
  fs.rmSync(TARGET_DOCS_DIR, { recursive: true, force: true });
  fs.rmSync(path.join(WORK_DIR, 'src', 'content', 'docs', 'docs.md'), { force: true });
  fs.rmSync(path.join(TARGET_BLOG_DIR, 'philosophy.md'), { force: true });
  fs.rmSync(path.join(TARGET_BLOG_DIR, 'feasibility-review-framework.md'), { force: true });
  fs.mkdirSync(TARGET_DOCS_DIR, { recursive: true });
  fs.mkdirSync(TARGET_BLOG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(UPDATES_JSON_PATH), { recursive: true });
}

function syncDocs() {
  const sourceCommit = sourceCommitForRepo();
  const fileMappings = createFileMappings({ sourceDateFor, sourceCommit });

  console.log(`Processing mirrored docs from seocho@${sourceCommit.slice(0, 12)}...`);
  cleanGeneratedOutputs();

  for (const mapping of fileMappings) {
    const sourcePath = path.join(SEOCHO_REPO_DIR, mapping.src);
    const destDir = mapping.isBlog ? TARGET_BLOG_DIR : TARGET_DOCS_DIR;
    const destPath = path.join(destDir, mapping.dest);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Warning: source file not found ${mapping.src}`);
      continue;
    }

    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(destPath, renderMirroredContent(mapping, sourceContent));
    console.log(`Synced: ${mapping.src} -> ${path.join(path.basename(destDir), mapping.dest)}`);
  }
}

function syncReleases() {
  console.log('Fetching latest 5 releases from tteon/seocho for changelog data...');
  try {
    const result = execSync('curl -s https://api.github.com/repos/tteon/seocho/releases?per_page=5');
    const releases = JSON.parse(result.toString());

    const updates = releases.map((release) => ({
      date: release.published_at ? release.published_at.split('T')[0] : 'Unknown',
      message: release.name || release.tag_name,
      hash: release.tag_name || 'v0.0.0',
      url: release.html_url,
      body: release.body,
    }));

    if (updates.length > 0) {
      fs.writeFileSync(UPDATES_JSON_PATH, JSON.stringify(updates, null, 2));
      console.log(`Synced ${updates.length} releases into updates.json`);
      return;
    }

    console.log('No releases found; preserving fallback updates.json');
    const fallbackUpdates = fs.existsSync(UPDATES_JSON_PATH)
      ? JSON.parse(fs.readFileSync(UPDATES_JSON_PATH, 'utf8'))
      : [
          {
            date: new Date().toISOString().split('T')[0],
            message: 'Sync integration established. Awaiting first release.',
            hash: 'init',
            url: 'https://github.com/tteon/seocho/releases',
            body: '...',
          },
        ];
    fs.writeFileSync(UPDATES_JSON_PATH, JSON.stringify(fallbackUpdates, null, 2));
  } catch (error) {
    console.error('Failed to fetch GitHub releases:', error.message);
  }
}

try {
  syncDocs();
  syncReleases();
  console.log('Sync complete.');
} finally {
  if (!USE_LOCAL_SOURCE) {
    fs.rmSync(TEMP_ROOT, { recursive: true, force: true });
  }
}
