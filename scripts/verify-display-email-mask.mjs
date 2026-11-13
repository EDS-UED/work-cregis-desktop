#!/usr/bin/env node
/**
 * 展示层邮箱：local 含 *、域名明文；禁域名段脱敏。种子块或 maskDisplayEmail( 除外。
 * 或同行/相邻行调用 maskDisplayEmail( / formatInitiatorValue(。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EDS_COMPONENTS = path.resolve(ROOT, '../eds-desktop/packages/components');

const EMAIL_RE =
  /['"`]([A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+)['"`]/g;

const SCAN_ROOTS = [
  path.join(ROOT, 'src'),
  EDS_COMPONENTS,
];

const IGNORE_DIRS = new Set(['node_modules', 'dist', '.git']);

function isAcceptableDisplayEmail(email) {
  const at = email.lastIndexOf('@');
  if (at <= 0) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const host = domain.split('.')[0] ?? '';
  if (host.includes('*')) return false;
  return local.includes('*');
}

function lineHasMaskHelper(line) {
  return (
    line.includes('maskDisplayEmail(')
    || line.includes('formatInitiatorValue(')
    || line.includes('maskWebhookCreatorEmail(')
  );
}

const SEED_ALLOW_LINE_SPAN = 48;

function scanFile(filePath) {
  if (filePath.endsWith('maskDisplayEmail.ts')) return [];

  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');
  const violations = [];
  let allowUntilLine = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.includes('email-display-seed')) {
      allowUntilLine = Math.max(allowUntilLine, i + SEED_ALLOW_LINE_SPAN);
    }
    if (line.trim().startsWith('*') || line.includes('例：`')) continue;
    if (lineHasMaskHelper(line)) continue;
    if (line.includes('member(')) continue;
    if (i <= allowUntilLine) continue;

    for (const match of line.matchAll(EMAIL_RE)) {
      const email = match[1];
      if (isAcceptableDisplayEmail(email)) continue;
      violations.push({ line: i + 1, email, snippet: line.trim().slice(0, 120) });
    }
  }

  return violations;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|vue|md)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const allViolations = [];
for (const root of SCAN_ROOTS) {
  for (const file of walk(root)) {
    const rel = path.relative(ROOT, file);
    for (const v of scanFile(file)) {
      allViolations.push({ file: rel, ...v });
    }
  }
}

if (allViolations.length > 0) {
  console.error('verify-display-email-mask: plaintext or partially masked emails in UI strings:\n');
  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line}  ${v.email}`);
    console.error(`    ${v.snippet}\n`);
  }
  process.exit(1);
}

console.log('verify-display-email-mask: ok');
