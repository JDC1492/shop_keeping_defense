# VULN-003: Any authenticated user can read any other user's order (IDOR)

## Metadata

| Field | Value |
|---|---|
| **ID** | VULN-003 |
| **Status** | Test written |
| **Category** | Security |
| **Severity** | High |
| **CVSS 3.1 vector & score** | `AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` (6.5) |
| **OWASP Top 10 (2021)** | A01:2021 Broken Access Control |
| **CWE** | CWE-639 Authorization Bypass Through User-Controlled Key |
| **Affected component** | `OrdersController#show`, `GET /api/orders/:id` |
| **Affected version / commit** | `v0-vulnerable` @ `abc1234` |
| **Reported by** | (security teammate) |
| **Date reported** | 2026-10-21 |
| **Assigned dev** | (developer teammate) |

> This is the worked example. Replace the placeholder names, date, and commit with real values
> once the app exists and the finding has actually been reproduced.

## Summary

The order detail endpoint looks up orders by ID without checking that the order belongs to the logged-in user. Any registered user can read any order, including name, shipping address, and line items, by changing the ID in the URL.

## Preconditions

- Attacker role: any registered, authenticated user
- Authentication required: yes (valid bearer token)
- Test data required: seeded users `alice@example.test` and `bob@example.test`; Bob owns at least one order

## Steps to reproduce

1. Log in as Alice and capture her token.
2. List Alice's own orders: `GET /api/orders`, note an ID that is hers.
3. Log in as Bob and list his orders to learn one of his IDs (or simply iterate IDs).
4. With Alice's token, request Bob's order: `GET /api/orders/<bob_order_id>`.
5. Observe `200 OK` with Bob's order body.
6. Iterate IDs `1..N` to enumerate every order in the system.

**Proof of concept:**

```bash
curl -s -H "Authorization: Bearer $TOKEN_ALICE" http://localhost:3000/api/orders/<bob_order_id>
```

## Expected vs. actual behavior

| | |
|---|---|
| **Expected (secure)** | `404 Not Found` (or `403`) for an order the caller does not own, with no order data in the body |
| **Actual (vulnerable)** | `200 OK` with the full order, including shipping address |

## Impact

- Confidentiality: full read access to every customer's order data and shipping address; sequential integer IDs make bulk enumeration trivial
- Integrity: none directly (read only); see VULN-004 for the matching write path
- Availability: none

## Root cause

`OrdersController#show` calls `Order.find(params[:id])` instead of scoping to the current user. Authentication is enforced; authorization is not.

## Recommended fix

**Do:** scope the lookup to the caller (`current_user.orders.find(params[:id])`) so a non-owned ID raises `RecordNotFound` and returns 404. Consider an authorization layer (Pundit or CanCanCan) so the rule is applied consistently across controllers.

**Don't:**
- Hide the problem by switching to UUIDs only. That makes guessing harder but does not add an ownership check.
- Check ownership in the React client. The API must enforce it.

## Regression tests

| Field | Playwright (QA) | RSpec (Dev) |
|---|---|---|
| **Test file** | `e2e/tests/api/idor.spec.ts` | `api/spec/requests/orders_spec.rb` |
| **Test name** | `VULN-003: user cannot read another user's order` | `VULN-003: returns 404 for another user's order` |
| **Layer** | API | Request spec |
| **Asserts** | Alice requesting Bob's order gets 403/404 and the body contains none of Bob's order data | Same behavior, in-process |
| **State on vulnerable build** | Expected failure (`test.fail()` while ID is in `open-findings.json`) | Pending (while ID is in `open-findings.json`) |
| **State after fix** | Passes (ID removed in fix PR) | Passes (ID removed in fix PR) |

## Fix tracking

| Field | Value |
|---|---|
| **Fix branch** | `fix/VULN-003-idor-orders` |
| **Pull request** | |
| **Fix commit** | |
| **Date fixed** | |

## Verification

- [ ] Original reproduction steps no longer work
- [ ] Variants attempted (other verbs on `/api/orders/:id`, `/api/orders?user_id=`, nested routes, admin token)
- [ ] Regression tests (Playwright and RSpec) fail if the fix is reverted
- [ ] ID removed from `findings/open-findings.json`
- [ ] No new issues introduced in adjacent endpoints
- [ ] Finding status updated to `Verified`

## References

- OWASP: A01:2021 Broken Access Control
- CWE-639: Authorization Bypass Through User-Controlled Key
- Related findings: VULN-004 (order update/cancel without ownership check)
