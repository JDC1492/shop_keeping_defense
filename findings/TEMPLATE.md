# VULN-XXX: Short, specific title

> Copy this file to `findings/VULN-XXX-short-slug.md`. Delete the guidance in italics as you fill it in.
> One finding per file. IDs are sequential and never reused, even if a finding is withdrawn.
> Also: add a row to `findings/README.md` and add the ID to `findings/open-findings.json`.

## Metadata

| Field | Value |
|---|---|
| **ID** | VULN-XXX |
| **Status** | `Open` / `Test written` / `Fix in review` / `Fixed` / `Verified` / `Won't fix` |
| **Category** | Security / Accessibility |
| **Severity** | Critical / High / Medium / Low / Info |
| **CVSS 3.1 vector & score** | e.g. `AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` (6.5) |
| **OWASP Top 10 (2021)** | e.g. A01:2021 Broken Access Control |
| **CWE** | e.g. CWE-639 Authorization Bypass Through User-Controlled Key |
| **WCAG criterion** | *Accessibility findings only, e.g. 1.4.3 Contrast (Minimum), Level AA* |
| **Affected component** | e.g. `OrdersController#show`, `GET /api/orders/:id` |
| **Affected version / commit** | e.g. `v0-vulnerable` @ `abc1234` |
| **Reported by** | Name |
| **Date reported** | YYYY-MM-DD |
| **Assigned dev** | Name |

## Summary

*Two or three sentences a non-specialist could read. What is wrong, who can exploit it, and what they get.*

## Preconditions

*What the attacker or user needs before starting: account type, network position, prior knowledge, specific data in the system.*

- Attacker role:
- Authentication required:
- Test data required:

## Steps to reproduce

*Numbered, exact, and runnable by someone who has never seen the app. Include requests, payloads, and the account used. Use only the seeded fake data.*

1.
2.
3.

**Proof of concept** *(request/response, curl command, or script path under `poc/`)*:

```bash
# example
curl -s -H "Authorization: Bearer $TOKEN_USER_A" http://localhost:3000/api/...
```

## Expected vs. actual behavior

| | |
|---|---|
| **Expected (secure)** | |
| **Actual (vulnerable)** | |

## Impact

*What an attacker can read, change, or disrupt. Be concrete: which data, how many records, what it chains into. For accessibility findings, describe which users are blocked and how (screen reader, keyboard only, low vision).*

- Confidentiality:
- Integrity:
- Availability:

## Root cause

*The underlying code or design mistake, with file and line references. Fill in after investigation, not just the symptom.*

## Recommended fix

*Specific and implementable. Name the pattern or framework feature to use.*

**Do:**

**Don't (common incomplete fixes):**

## Regression tests

Every finding has a Playwright test (QA). The dev adds an RSpec request spec in the fix PR.
Test titles in both suites start with `VULN-XXX:` so a failure points straight at this file.

| Field | Playwright (QA) | RSpec (Dev) |
|---|---|---|
| **Test file** | e.g. `e2e/tests/api/idor.spec.ts` | e.g. `api/spec/requests/orders_spec.rb` |
| **Test name** | e.g. `VULN-003: user cannot read another user's order` | e.g. `VULN-003: returns 404 for another user's order` |
| **Layer** | API / Browser / Accessibility | Request spec |
| **Asserts** | *The secure behavior in one sentence* | *Same behavior, in-process* |
| **State on vulnerable build** | Expected failure (`test.fail()` while ID is in `open-findings.json`) | Pending (while ID is in `open-findings.json`) |
| **State after fix** | Passes (ID removed in fix PR) | Passes (ID removed in fix PR) |

## Fix tracking

| Field | Value |
|---|---|
| **Fix branch** | `fix/VULN-XXX-short-slug` |
| **Pull request** | #NN |
| **Fix commit** | |
| **Date fixed** | |

## Verification

*Completed by the security reviewer after the fix merges. A green test is necessary but not sufficient.*

- [ ] Original reproduction steps no longer work
- [ ] Variants attempted (different IDs, verbs, encodings, roles, parameters)
- [ ] Regression tests (Playwright and RSpec) fail if the fix is reverted
- [ ] ID removed from `findings/open-findings.json`
- [ ] No new issues introduced in adjacent endpoints or components
- [ ] Finding status updated to `Verified`

**Verified by:** | **Date:**

## References

- OWASP:
- CWE:
- WCAG (accessibility findings):
- Related findings: VULN-
