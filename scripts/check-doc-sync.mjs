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
const TMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'seocho-doc-sync-'));
const SEOCHO_REPO_DIR = USE_LOCAL_SOURCE
  ? LOCAL_SEOCHO_REPO_DIR
  : path.join(TMP_ROOT, 'seocho');
const TARGET_DOCS_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'docs');
const TARGET_BLOG_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'blog');

if (!USE_LOCAL_SOURCE) {
  console.log('Cloning tteon/seocho for docs sync verification...');
  execSync(`git clone --filter=blob:none https://github.com/tteon/seocho.git ${SEOCHO_REPO_DIR}`, {
    stdio: 'inherit',
  });
} else {
  console.log(`Using explicit SEOCHO source at ${SEOCHO_REPO_DIR}`);
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

try {
  const sourceCommit = sourceCommitForRepo();
  const fileMappings = createFileMappings({ sourceDateFor, sourceCommit });
  const drifted = [];

  for (const mapping of fileMappings) {
    const destDir = mapping.isBlog ? TARGET_BLOG_DIR : TARGET_DOCS_DIR;
    const destPath = path.join(destDir, mapping.dest);
    const sourcePath = path.join(SEOCHO_REPO_DIR, mapping.src);

    if (!fs.existsSync(sourcePath)) {
      drifted.push(`${mapping.src}: missing source file in seocho`);
      continue;
    }

    if (!fs.existsSync(destPath)) {
      drifted.push(`${mapping.dest}: missing mirrored file`);
      continue;
    }

    const expected = renderMirroredContent(mapping, fs.readFileSync(sourcePath, 'utf8'));
    const actual = fs.readFileSync(destPath, 'utf8');
    if (expected !== actual) {
      drifted.push(`${mapping.dest}: mirrored content differs from seocho@${sourceCommit.slice(0, 12)}`);
    }
  }

  if (drifted.length > 0) {
    console.error('Docs sync drift detected:');
    for (const item of drifted) {
      console.error(`- ${item}`);
    }
    console.error('\nRun `node scripts/sync.mjs` and commit the generated mirror updates.');
    process.exit(1);
  }

  console.log(`Docs sync check passed against seocho@${sourceCommit.slice(0, 12)}.`);
} finally {
  if (!USE_LOCAL_SOURCE) {
    fs.rmSync(TMP_ROOT, { recursive: true, force: true });
  }
}
