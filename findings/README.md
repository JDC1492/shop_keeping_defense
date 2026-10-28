# Findings index

One row per finding. Keep this table in sync with `open-findings.json` and each finding's status.

| ID | Title | Category | Severity | Status | Playwright test | RSpec spec | PR |
|---|---|---|---|---|---|---|---|
| [VULN-003](VULN-003-idor-orders.md) | Any authenticated user can read any other user's order (IDOR) | Security | High | Test written | `e2e/tests/api/idor.spec.ts` | `api/spec/requests/orders_spec.rb` | |

## Adding a finding

1. Copy [`TEMPLATE.md`](TEMPLATE.md) to `VULN-XXX-slug.md` (next unused ID; never reuse).
2. Add a row above.
3. Add the ID to [`open-findings.json`](open-findings.json) so its tests are expected to fail.
4. Fix PR removes the ID from `open-findings.json`.
