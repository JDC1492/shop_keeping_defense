// Seeded lab users. Must match the seed table in docs/API_CONTRACT.md.
// The password is a lab-only fake supplied by the same SEED_PASSWORD variable the API seeds with.

export interface SeedUser {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

const password = process.env.SEED_PASSWORD ?? 'Password123!';

export const SEED_USERS = {
  alice: { email: 'alice@example.test', password, role: 'user' },
  bob: { email: 'bob@example.test', password, role: 'user' },
  admin: { email: 'admin@example.test', password, role: 'admin' },
} as const satisfies Record<string, SeedUser>;
