# Workflow and conventions

## The cycle

1. **Dev** plants a flaw on `main` (tagged `v0-vulnerable` for the initial build).
2. **Security** exploits it and opens a finding: copy `findings/TEMPLATE.md` to `findings/VULN-XXX-slug.md`, add a row to `findings/README.md`, and add the ID to `findings/open-findings.json`.
3. **QA** writes the Playwright test asserting the *secure* behavior. Status becomes `Test written`.
4. **Dev** opens `fix/VULN-XXX-slug`, fixes the flaw, adds an RSpec request spec, and **removes the ID from `findings/open-findings.json`**. Status becomes `Fix in review`.
5. CI is green only if the tests now pass for real. Merge. Status becomes `Fixed`.
6. **Security** completes the verification checklist in the finding. Status becomes `Verified`.

## Statuses

`Open` → `Test written` → `Fix in review` → `Fixed` → `Verified` (or `Won't fix`).

## How red-to-green works

`findings/open-findings.json` lists IDs of findings that are still vulnerable.

- ID listed: tests tagged with that ID are expected to fail. Playwright marks them `test.fail()`; RSpec marks them `pending`. CI is green while the bug exists.
- ID removed: tests run normally and must pass.
- ID still listed after a real fix: the "expected failure" tests pass, which Playwright reports as a failure (and RSpec reports a pending example that passed as a failure). Nobody can fix a bug without updating the record.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Finding file | `findings/VULN-XXX-short-slug.md` | `VULN-003-idor-orders.md` |
| Fix branch | `fix/VULN-XXX-short-slug` | `fix/VULN-003-idor-orders` |
| Playwright test title | starts with `VULN-XXX:` | `VULN-003: user cannot read another user's order` |
| RSpec example | starts with `VULN-XXX:` | `it "VULN-003: returns 404 for another user's order"` |
| Accessibility tests | `A11Y-XXX:` for specific findings, route name for scans | `A11Y-001: login inputs have labels` |
| Commit / PR title | `VULN-XXX: <what changed>` | `VULN-003: scope order lookup to current user` |

Every test title must start with its finding ID. The helpers in `e2e/support/open-findings.ts` and
`api/spec/support/open_findings.rb` parse the ID from the title to decide whether to expect failure.

## Which test goes where

| Layer | Owner | Location | Use for |
|---|---|---|---|
| Playwright API | QA | `e2e/tests/api/` | Black-box exploit regressions over HTTP |
| Playwright browser | QA | `e2e/tests/browser/` | XSS execution, UI-level access control |
| Playwright a11y | QA | `e2e/tests/a11y/` | axe-core scans per route and key flow |
| RSpec request specs | Dev | `api/spec/requests/` | Fast in-process lock-in of each fix |

Every security finding gets a Playwright test. The dev adds the RSpec spec in the fix PR.

## Severity

- Security findings: CVSS 3.1 vector and score, plus Critical/High/Medium/Low/Info.
- Accessibility findings: High (blocks a task for some users), Medium (hard but possible), Low (annoyance).

## Accessibility baseline

axe scans run with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Scans that are expected to fail
until a finding is fixed use an `A11Y-XXX:` title and the same open-findings mechanism.
