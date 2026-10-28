# VULN-XXX: Any authenticated user can read any other user's order (IDOR)

## Metadata

| Field                         | Value                                                    |
| ----------------------------- | -------------------------------------------------------- |
| **ID**                        | VULN-XXX                                                 |
| **Status**                    | Test written                                             |
| **Category**                  | Security                                                 |
| **Severity**                  | High                                                     |
| **CVSS 3.1 vector & score**   | `AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` (6.5)              |
| **OWASP Top 10 (2021)**       | A01:2021 Broken Access Control                           |
| **CWE**                       | CWE-639 Authorization Bypass Through User-Controlled Key |
| **Affected component**        | `OrdersController#show`, `GET /api/orders/:id`           |
| **Affected version / commit** | `v0-vulnerable` @ `abc1234`                              |
| **Reported by**               | (security teammate)                                      |
| **Date reported**             | 2026-10-21                                               |
| **Assigned dev**              | (developer teammate)                                     |

## Summary

The order detail endpoint looks up orders by ID without checking that the order belongs to the logged-in user. Any registered user can read any order, including name, shipping address, and line items, by changing the ID in the URL.

## Preconditions

- Attacker role: any registered, authenticated user
- Authentication required: yes (valid bearer token)
- Test data required: seeded users `alice@example.test` and `bob@example.test`; Bob owns order `2`

## Steps to reproduce

1. Log in as Alice and capture her token.
2. Request one of Alice's own orders: `GET /api/orders/1` returns `200`.
3. With the same token, request an order Alice does not own: `GET /api/orders/2`.
4. Observe `200 OK` with Bob's order body.
5. Iterate IDs `1..N` to enumerate every order in the system.

**Proof of concept:**

```bash
curl -s -H "Authorization: Bearer $TOKEN_ALICE" http://localhost:3000/api/orders/2
```

## Expected vs. actual behavior

|                         |                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| **Expected (secure)**   | `404 Not Found` (or `403`) for an order the caller does not own, with no order data in the body |
| **Actual (vulnerable)** | `200 OK` with the full order, including shipping address                                        |

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

## Regression test

| Field                         | Value                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| **Test file**                 | `tests/security/idor.spec.ts`                                                                       |
| **Test name**                 | `VULN-003: user cannot read another user's order`                                                   |
| **Layer**                     | API                                                                                                 |
| **Asserts**                   | Alice requesting Bob's order gets 403/404 and the response body contains none of Bob's order fields |
| **State on vulnerable build** | Fails (marked `test.fail()` until fixed)                                                            |
| **State after fix**           | Passes (marker removed in fix PR)                                                                   |

## Fix tracking

| Field            | Value                      |
| ---------------- | -------------------------- |
| **Fix branch**   | `fix/VULN-003-idor-orders` |
| **Pull request** |                            |
| **Fix commit**   |                            |
| **Date fixed**   |                            |

## Verification

- [ ] Original reproduction steps no longer work
- [ ] Variants attempted (other verbs on `/api/orders/:id`, `/api/orders?user_id=`, nested routes, admin token)
- [ ] Regression test fails if the fix is reverted
- [ ] No new issues introduced in adjacent endpoints
- [ ] Finding status updated to `Verified`

## References

- OWASP: A01:2021 Broken Access Control
- CWE-639: Authorization Bypass Through User-Controlled Key
- Related findings: VULN-004 (order update/cancel without ownership check)
