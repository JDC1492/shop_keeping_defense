import { test, expect } from '../../fixtures/auth';

interface Order {
  id: number;
  user_id: number;
  shipping_name: string;
  shipping_address: string;
}

test.describe('Orders access control', () => {
  // Control: proves the endpoint works for the owner, so a failure below is about
  // authorization and not a broken setup. This has no finding ID, so it must always pass.
  test('control: user can read their own order', async ({ alice }) => {
    const list = await alice.get('/api/orders');
    expect(list.status()).toBe(200);
    const { orders } = (await list.json()) as { orders: Order[] };
    expect(orders.length).toBeGreaterThan(0);

    const res = await alice.get(`/api/orders/${orders[0].id}`);
    expect(res.status()).toBe(200);
  });

  // VULN-003. Asserts the SECURE behavior. Fails on the vulnerable build (expected while the
  // ID is in findings/open-findings.json), passes once the fix removes the ID.
  test("VULN-003: user cannot read another user's order", async ({ alice, bob }) => {
    const bobList = await bob.get('/api/orders');
    expect(bobList.status()).toBe(200);
    const { orders: bobOrders } = (await bobList.json()) as { orders: Order[] };
    expect(bobOrders.length, 'seed data: bob must own at least one order').toBeGreaterThan(0);
    const target = bobOrders[0];

    const res = await alice.get(`/api/orders/${target.id}`);

    expect([403, 404]).toContain(res.status());
    const body = await res.text();
    expect(body).not.toContain(target.shipping_address);
    expect(body).not.toContain(target.shipping_name);
  });
});
