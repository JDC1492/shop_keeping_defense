import * as fs from 'node:fs';
import * as path from 'node:path';

// findings/open-findings.json is the single source of truth for which findings are still
// vulnerable. Tests whose title starts with an open finding ID are expected to fail.

const FINDINGS_PATH =
  process.env.OPEN_FINDINGS_PATH ??
  path.resolve(__dirname, '../../findings/open-findings.json');

// Matches "VULN-003: ..." or "A11Y-001: ..." at the start of a test title.
const ID_PATTERN = /^((?:VULN|A11Y)-\d+):/;

let cached: Set<string> | undefined;

export function openFindings(): Set<string> {
  if (!cached) {
    const raw = JSON.parse(fs.readFileSync(FINDINGS_PATH, 'utf8')) as { open?: string[] };
    cached = new Set(raw.open ?? []);
  }
  return cached;
}

export function findingIdFromTitle(title: string): string | undefined {
  return ID_PATTERN.exec(title)?.[1];
}

export function isOpen(id: string): boolean {
  return openFindings().has(id);
}
