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
const TMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'seocho-doc-sync-'));
const SEOCHO_REPO_DIR = USE_LOCAL_SOURCE
  ? LOCAL_SEOCHO_REPO_DIR
  : path.join(TMP_ROOT, 'seocho');
const TARGET_DOCS_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'docs');
const TARGET_BLOG_DIR = path.join(WORK_DIR, 'src', 'content', 'docs', 'blog');

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

const fileMappings = [
  {
    src: 'docs/README.md',
    dest: 'index.md',
    frontmatter:
      '---\n' +
      'title: Docs Home\n' +
      'description: Central Documentation Index for SEOCHO\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/README.md`*\n\n',
  },
  {
    src: 'docs/QUICKSTART.md',
    dest: 'quickstart.md',
    frontmatter:
      '---\n' +
      'title: Quickstart\n' +
      'description: Get SEOCHO up and running in 5 minutes.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/QUICKSTART.md`*\n\n',
  },
  {
    src: 'docs/APPLY_YOUR_DATA.md',
    dest: 'apply_your_data.md',
    frontmatter:
      '---\n' +
      'title: Bring Your Data\n' +
      'description: How to load your own records into SEOCHO and query them safely.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/APPLY_YOUR_DATA.md`*\n\n',
  },
  {
    src: 'docs/PYTHON_INTERFACE_QUICKSTART.md',
    dest: 'python_sdk.md',
    frontmatter:
      '---\n' +
      'title: Python SDK\n' +
      'description: Developer-first guide to ingest data and query SEOCHO through the Python SDK.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/PYTHON_INTERFACE_QUICKSTART.md`*\n\n',
  },
  {
    src: 'docs/FILES_AND_ARTIFACTS.md',
    dest: 'files_and_artifacts.md',
    frontmatter:
      '---\n' +
      'title: Files and Artifacts\n' +
      'description: Where ontology files, graph state, rule profiles, semantic artifacts, and traces live.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/FILES_AND_ARTIFACTS.md`*\n\n',
  },
  {
    src: 'docs/ARCHITECTURE.md',
    dest: 'architecture.md',
    frontmatter:
      '---\n' +
      'title: Architecture\n' +
      'description: System Architecture and Module Map.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/ARCHITECTURE.md`*\n\n',
  },
  {
    src: 'docs/WORKFLOW.md',
    dest: 'workflow.md',
    isBlog: false,
    frontmatter:
      '---\n' +
      'title: Workflow\n' +
      'description: End-to-end Operational Workflow.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/WORKFLOW.md`*\n\n',
  },
  {
    src: 'docs/PHILOSOPHY.md',
    dest: 'philosophy.md',
    isBlog: true,
    frontmatter:
      '---\n' +
      'title: "SEOCHO Design Philosophy & Operating Principles"\n' +
      `date: ${sourceDateFor('docs/PHILOSOPHY.md')}\n` +
      'authors:\n' +
      '  - seocho\n' +
      'excerpt: Extract domain rules and high-value semantics from heterogeneous data into a SHACL-like semantic layer.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/PHILOSOPHY.md`*\n\n',
  },
  {
    src: 'docs/PHILOSOPHY_FEASIBILITY_REVIEW.md',
    dest: 'feasibility-review-framework.md',
    isBlog: true,
    frontmatter:
      '---\n' +
      'title: "Feasibility Review Framework & Rubrics"\n' +
      `date: ${sourceDateFor('docs/PHILOSOPHY_FEASIBILITY_REVIEW.md')}\n` +
      'authors:\n' +
      '  - seocho\n' +
      'excerpt: Multi-role feasibility review framework and Go/No-Go rubric for graph data implementations.\n' +
      '---\n\n' +
      '> *Source mirrored from `seocho/docs/PHILOSOPHY_FEASIBILITY_REVIEW.md`*\n\n',
  },
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

function renderMirroredContent(mapping) {
  const sourcePath = path.join(SEOCHO_REPO_DIR, mapping.src);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source file in SEOCHO repo: ${mapping.src}`);
  }

  let content = fs.readFileSync(sourcePath, 'utf8');
  content = content.replace(/^#\s(.*?)\n/m, '');
  content = rewriteWebsiteRoutes(content);
  return mapping.frontmatter + content;
}

try {
  if (USE_LOCAL_SOURCE) {
    console.log(`Using local SEOCHO source at ${SEOCHO_REPO_DIR}`);
  } else {
    console.log('Cloning tteon/seocho for docs sync verification...');
    execSync(`git clone --depth 1 https://github.com/tteon/seocho.git ${SEOCHO_REPO_DIR}`, {
      stdio: 'inherit',
    });
  }

  const drifted = [];

  for (const mapping of fileMappings) {
    const destDir = mapping.isBlog ? TARGET_BLOG_DIR : TARGET_DOCS_DIR;
    const destPath = path.join(destDir, mapping.dest);

    if (!fs.existsSync(destPath)) {
      drifted.push(`${mapping.dest}: missing mirrored file`);
      continue;
    }

    const expected = renderMirroredContent(mapping);
    const actual = fs.readFileSync(destPath, 'utf8');
    if (expected !== actual) {
      drifted.push(`${mapping.dest}: mirrored content differs from seocho source`);
    }
  }

  if (drifted.length > 0) {
    console.error('Docs sync drift detected:');
    for (const item of drifted) {
      console.error(`- ${item}`);
    }
    process.exit(1);
  }

  console.log('Docs sync check passed.');
} finally {
  if (!USE_LOCAL_SOURCE) {
    fs.rmSync(TMP_ROOT, { recursive: true, force: true });
  }
}
