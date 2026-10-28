## What this PR does

<!-- One or two sentences. -->

## Finding

- Finding: `VULN-XXX` (link to `findings/VULN-XXX-slug.md`)
- Type: [ ] New finding / test  [ ] Fix  [ ] Tooling / docs

## Checklist (fix PRs)

- [ ] Branch is named `fix/VULN-XXX-short-slug`
- [ ] ID **removed** from `findings/open-findings.json`
- [ ] Playwright test for the finding now passes (not just "expected to fail")
- [ ] RSpec request spec added, with a description starting `VULN-XXX:`
- [ ] Finding status updated to `Fix in review`, and `findings/README.md` row updated
- [ ] No unrelated changes mixed in

## Checklist (new finding / test PRs)

- [ ] Finding file created from `findings/TEMPLATE.md`
- [ ] ID **added** to `findings/open-findings.json`
- [ ] Test title starts with `VULN-XXX:` and asserts the **secure** behavior
- [ ] Test fails on the vulnerable build for the right reason (not a broken setup)

## Security sign-off (after merge)

- [ ] Reproduction steps no longer work
- [ ] Variants attempted
- [ ] Finding status set to `Verified`
