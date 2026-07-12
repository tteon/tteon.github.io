import fs from 'fs';
import { execSync } from 'child_process';

const args = new Set(process.argv.slice(2));
const removeAstro = args.has('--astro') || args.has('--ci') || args.has('--force');
const force = args.has('--force') || args.has('--ci') || process.env.CI === 'true';
const targets = ['dist'];

if (removeAstro) {
  targets.push('.astro');
  targets.push('node_modules/.astro');
}

function astroDevLooksActive() {
  if (process.platform === 'win32') {
    return false;
  }

  try {
    const output = execSync('pgrep -fl "astro dev"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return output.length > 0;
  } catch {
    return false;
  }
}

if (removeAstro && !force && astroDevLooksActive()) {
  console.error(
    [
      'Astro dev server appears to be running.',
      'Stop `npm run dev` before deleting `.astro`, or use `npm run rebuild` when you intentionally want a full cache reset.',
    ].join('\n')
  );
  process.exit(1);
}

for (const target of targets) {
  fs.rmSync(target, { recursive: true, force: true });
  console.log(`Removed ${target}/`);
}
