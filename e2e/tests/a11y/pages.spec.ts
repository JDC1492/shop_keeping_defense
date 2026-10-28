import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/auth';

// Routes listed in docs/API_CONTRACT.md ("Frontend routes the accessibility tests visit").
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/login', name: 'login' },
];

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// When the first violation is found and filed as A11Y-001, rename the matching test title to
// start with "A11Y-001:" and add the ID to findings/open-findings.json. See docs/WORKFLOW.md.
for (const route of ROUTES) {
  test(`a11y: ${route.name} page has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    // Readable failure output: rule, impact, and the offending elements.
    const summary = results.violations.map((v) => ({
      rule: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.target.join(' ')),
    }));
    expect(summary).toEqual([]);
  });
}
