import { test } from '../../fixtures/auth';

// Placeholder for the stored XSS finding. Replace `fixme` with a real test once the comments
// feature exists and Security has filed the finding. Sketch of the intended assertion:
//
//   1. Log in as alice and post a comment whose body is a benign, inert marker payload
//      (for example an element that sets `window.__xss = true` when parsed as HTML).
//   2. Visit the page as bob and wait for the comment to render.
//   3. Assert `await page.evaluate(() => (window as any).__xss)` is not true, i.e. the
//      payload was rendered as text and not executed.
//
// Keep payloads inert and scoped to this lab. Title must start with the finding ID, e.g.
// "VULN-005: stored comment content is not executed in the browser".

test.fixme('VULN-005: stored comment content is not executed in the browser', async () => {});
