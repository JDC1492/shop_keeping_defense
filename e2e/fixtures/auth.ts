import { test as base, expect, request, type APIRequestContext } from '@playwright/test';
import { SEED_USERS, type SeedUser } from '../support/seed';
import { findingIdFromTitle, isOpen } from '../support/open-findings';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';

async function loginAs(user: SeedUser): Promise<APIRequestContext> {
  const anonymous = await request.newContext({ baseURL: API_URL });
  const res = await anonymous.post('/api/login', {
    data: { email: user.email, password: user.password },
  });
  if (!res.ok()) {
    const body = await res.text();
    await anonymous.dispose();
    throw new Error(`Login failed for ${user.email}: ${res.status()} ${body}. Did you run db:seed?`);
  }
  const { token } = (await res.json()) as { token: string };
  await anonymous.dispose();

  return request.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
  });
}

type Fixtures = {
  /** Authenticated API context for alice@example.test */
  alice: APIRequestContext;
  /** Authenticated API context for bob@example.test */
  bob: APIRequestContext;
  /** Authenticated API context for admin@example.test */
  admin: APIRequestContext;
  /** Runs for every test: marks it as expected-to-fail while its finding is open. */
  expectOpenFindingsToFail: void;
};

export const test = base.extend<Fixtures>({
  expectOpenFindingsToFail: [
    async ({}, use, testInfo) => {
      const id = findingIdFromTitle(testInfo.title);
      if (id && isOpen(id)) {
        testInfo.fail(true, `${id} is open in findings/open-findings.json`);
      }
      await use();
    },
    { auto: true },
  ],

  alice: async ({}, use) => {
    const ctx = await loginAs(SEED_USERS.alice);
    await use(ctx);
    await ctx.dispose();
  },
  bob: async ({}, use) => {
    const ctx = await loginAs(SEED_USERS.bob);
    await use(ctx);
    await ctx.dispose();
  },
  admin: async ({}, use) => {
    const ctx = await loginAs(SEED_USERS.admin);
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect };
