# VULN-XXX: Short, specific title

> Copy this file to `findings/VULN-XXX-short-slug.md`. Delete the guidance in italics as you fill it in.
> One finding per file. IDs are sequential and never reused, even if a finding is withdrawn.

## Metadata

| Field                         | Value                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------ |
| **ID**                        | VULN-XXX                                                                       |
| **Status**                    | `Open` / `Test written` / `Fix in review` / `Fixed` / `Verified` / `Won't fix` |
| **Category**                  | Security / Accessibility                                                       |
| **Severity**                  | Critical / High / Medium / Low / Info                                          |
| **CVSS 3.1 vector & score**   | e.g. `AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` (6.5)                               |
| **OWASP Top 10 (2021)**       | e.g. A01:2021 Broken Access Control                                            |
| **CWE**                       | e.g. CWE-639 Authorization Bypass Through User-Controlled Key                  |
| **WCAG criterion**            | _Accessibility findings only, e.g. 1.4.3 Contrast (Minimum), Level AA_         |
| **Affected component**        | e.g. `OrdersController#show`, `GET /api/orders/:id`                            |
| **Affected version / commit** | e.g. `v0-vulnerable` @ `abc1234`                                               |
| **Reported by**               | Name                                                                           |
| **Date reported**             | YYYY-MM-DD                                                                     |
| **Assigned dev**              | Name                                                                           |

## Summary

_Two or three sentences a non-specialist could read. What is wrong, who can exploit it, and what they get._

## Preconditions

_What the attacker or user needs before starting: account type, network position, prior knowledge, specific data in the system._

- Attacker role:
- Authentication required:
- Test data required:

## Steps to reproduce

_Numbered, exact, and runnable by someone who has never seen the app. Include requests, payloads, and the account used. Use only the seeded fake data._

1.
2.
3.

**Proof of concept** _(request/response, curl command, or script path under `poc/`)_:

```bash
# example
curl -s -H "Authorization: Bearer $TOKEN_USER_A" http://localhost:3000/api/...
```

## Expected vs. actual behavior

|                         |     |
| ----------------------- | --- |
| **Expected (secure)**   |     |
| **Actual (vulnerable)** |     |

## Impact

_What an attacker can read, change, or disrupt. Be concrete: which data, how many records, what it chains into. For accessibility findings, describe which users are blocked and how (screen reader, keyboard only, low vision)._

- Confidentiality:
- Integrity:
- Availability:

## Root cause

_The underlying code or design mistake, with file and line references. Fill in after investigation, not just the symptom._

## Recommended fix

_Specific and implementable. Name the pattern or framework feature to use._

**Do:**

**Don't (common incomplete fixes):**

## Regression test

| Field                         | Value                                                  |
| ----------------------------- | ------------------------------------------------------ |
| **Test file**                 | e.g. `tests/security/idor.spec.ts`                     |
| **Test name**                 | e.g. `VULN-003: user cannot read another user's order` |
| **Layer**                     | API / Browser / Accessibility / RSpec request spec     |
| **Asserts**                   | _The secure behavior in one sentence_                  |
| **State on vulnerable build** | Fails (marked `test.fail()` until fixed)               |
| **State after fix**           | Passes (marker removed in fix PR)                      |

## Fix tracking

| Field            | Value                     |
| ---------------- | ------------------------- |
| **Fix branch**   | `fix/VULN-XXX-short-slug` |
| **Pull request** | #NN                       |
| **Fix commit**   |                           |
| **Date fixed**   |                           |

## Verification

_Completed by the security reviewer after the fix merges. A green test is necessary but not sufficient._

- [ ] Original reproduction steps no longer work
- [ ] Variants attempted (different IDs, verbs, encodings, roles, parameters)
- [ ] Regression test fails if the fix is reverted
- [ ] No new issues introduced in adjacent endpoints or components
- [ ] Finding status updated to `Verified`

**Verified by:** | **Date:**

## References

- OWASP:
- CWE:
- WCAG (accessibility findings):
- Related findings: VULN-
