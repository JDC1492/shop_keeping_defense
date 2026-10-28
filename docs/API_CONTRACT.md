# API contract

The Playwright tests, RSpec specs, and seed data all rely on this contract. If an endpoint or
shape changes, update this file in the same PR.

Base URL: `http://localhost:3000`. All bodies are JSON. Authenticated requests send
`Authorization: Bearer <token>`.

## Endpoints (initial set)

### `GET /up`
Health check. `200` when the app is ready.

### `POST /api/login`
Request: `{ "email": "...", "password": "..." }`

- `200` → `{ "token": "...", "user": { "id": 1, "email": "...", "role": "user" } }`
- `401` → `{ "error": "invalid_credentials" }`

### `GET /api/orders`
Returns **only the caller's** orders.

- `200` → `{ "orders": [Order, ...] }`
- `401` if no/invalid token

### `GET /api/orders/:id`
Returns a single order.

- `200` → `Order` (top-level object, not wrapped)
- `404` → `{ "error": "not_found" }` when the order does not exist (and, once VULN-003 is fixed, when it is not the caller's)
- `401` if no/invalid token

> **Planted flaw (VULN-003 draft):** the vulnerable build returns `200` for any order ID. The
> *secure* behavior above is what the tests assert.

### `Order` shape

```json
{
  "id": 1,
  "user_id": 1,
  "total_cents": 4599,
  "shipping_name": "Alice Example",
  "shipping_address": "123 Alice Way, Faketown, ZZ 00001",
  "items": [{ "sku": "WIDGET-1", "quantity": 2, "price_cents": 1500 }]
}
```

Add new endpoints here (search, comments, password reset, admin) as the dev plants those flaws.

## Seed data (`bin/rails db:seed`)

Passwords for all seeded users come from `SEED_PASSWORD` (default `Password123!`, a lab-only fake).

| User | Role | Orders |
|---|---|---|
| `alice@example.test` | user | 2, each with a distinct shipping address |
| `bob@example.test` | user | 2, each with a distinct shipping address |
| `admin@example.test` | admin | 0 |

Tests look up order IDs through `GET /api/orders` as each user, so they do not depend on
specific numeric IDs.

## Frontend routes the accessibility tests visit

| Route | Page |
|---|---|
| `/` | Home / order list |
| `/login` | Login form |

Add routes here as pages are added.
