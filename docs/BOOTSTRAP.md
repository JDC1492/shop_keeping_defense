# Dev bootstrap checklist

The test layer expects an app that matches [`API_CONTRACT.md`](API_CONTRACT.md). Work through this
list to get to a first runnable build.

## Rails API (`api/`)

- [ ] `rails new api --api -d postgresql --skip-test` (Rails 7.1+ for the `/up` health endpoint)
- [ ] Add `rspec-rails` to the `:development, :test` group and run `rails g rspec:install`
- [ ] Add a `Dockerfile` that runs the server on `0.0.0.0:3000` and has `curl` installed (the compose healthcheck uses it)
- [ ] Read `DATABASE_URL` from the environment
- [ ] Models: `User` (email, password digest, role), `Order` (user, total_cents, shipping fields, items)
- [ ] `POST /api/login` returning a token (the token scheme itself can be weak on purpose, see future findings)
- [ ] `GET /api/orders` scoped to the current user
- [ ] `GET /api/orders/:id` using `Order.find(params[:id])` with **no ownership check** (the VULN-003 flaw)
- [ ] `db/seeds.rb` creating the users and orders listed in `API_CONTRACT.md`; passwords from `ENV["SEED_PASSWORD"]`
- [ ] Copy the RSpec support helper already in `api/spec/support/open_findings.rb` and require it from `rails_helper.rb`:
  `Dir[Rails.root.join("spec/support/**/*.rb")].sort.each { |f| require f }`

## React app (`web/`)

- [ ] Vite + React (port 5173, `--host 0.0.0.0`) with a `Dockerfile`
- [ ] Routes `/` and `/login` per the contract
- [ ] A login form (deliberately missing accessible labels is a good first accessibility flaw)

## First run

```bash
docker compose up --build -d
docker compose exec api bin/rails db:seed
cd e2e && npm ci && npx playwright install chromium && npx playwright test
```

Expected result on the vulnerable build: the API tests pass (VULN-003 is listed as open, so its
test is expected to fail and counts as green). The two `a11y:` scans pass only if the pages have no
WCAG A/AA violations. When the dev plants an accessibility flaw they will go red: that is the cue
for Security to file an `A11Y-XXX` finding, and for QA to rename the scan to start with that ID and
add it to `findings/open-findings.json` (see `docs/WORKFLOW.md`).

## Planting the next flaws

Add the endpoint and its contract entry, then hand it to Security. Ideas already planned: SQL
injection in search, stored XSS in comments, weak password-reset tokens, mass assignment of `role`,
admin routes guarded only in the UI.
