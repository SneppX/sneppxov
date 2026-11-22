const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const baseURL = process.env.SITE_URL || 'http://127.0.0.1:4173';

async function checkAccessibility(page, route) {
  await page.goto(baseURL + route, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const violations = results.violations.map(item => ({
    id: item.id,
    impact: item.impact,
    nodes: item.nodes.map(node => node.target),
  }));
  assert.equal(violations.length, 0, route + ' accessibility violations: ' + JSON.stringify(violations));
}

(async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    await page.goto(baseURL + '/index.html', { waitUntil: 'networkidle' });
    assert.match(await page.title(), /SneppX/);
    await page.keyboard.press('Control+k');
    const search = page.getByRole('searchbox', { name: 'Search pages and resources' });
    await search.fill('VSTodo');
    await page.getByRole('link', { name: 'VSTodo Git adoption and migration' }).waitFor();
    await page.getByRole('link', { name: 'VSTodo Git adoption and migration' }).click();
    await page.getByRole('heading', { name: /Try VSTodo without throwing away your Git repository/ }).waitFor();
    await page.locator('pre').filter({ hasText: 'vstodo sync-git' }).first().waitFor();

    await page.goto(baseURL + '/project.html?id=vstodo', { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'VSTodo' }).waitFor();
    await page.getByRole('link', { name: 'Architecture overview' }).waitFor();

    await page.route('https://api.github.com/repos/**', async route => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/commits')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            sha: 'abcdef0123456789',
            html_url: 'https://github.com/SneppX/vstodo/commit/abcdef0123456789',
            commit: { message: 'Test commit from browser fixture', author: { date: '2026-11-22T00:00:00Z' } },
          }]),
        });
        return;
      }
      if (url.pathname.endsWith('/releases')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            name: 'VSTodo fixture release',
            tag_name: 'v0.1.0',
            html_url: 'https://github.com/SneppX/vstodo/releases/tag/v0.1.0',
            published_at: '2026-11-22T00:00:00Z',
            prerelease: false,
          }]),
        });
        return;
      }
      await route.abort();
    });
    await page.goto(baseURL + '/updates.html', { waitUntil: 'networkidle' });
    await page.locator('[data-repo="SneppX/vstodo"]').getByText('Test commit from browser fixture').waitFor();
    await page.locator('[data-repo="SneppX/vstodo"]').getByText('VSTodo fixture release').waitFor();

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(baseURL + '/index.html', { waitUntil: 'networkidle' });
    const menu = page.locator('#hamburger');
    assert.equal(await menu.getAttribute('aria-label'), 'Open navigation menu');
    await menu.click();
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    assert.equal(await menu.getAttribute('aria-label'), 'Close navigation menu');
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    assert.equal(await menu.getAttribute('aria-label'), 'Open navigation menu');

    await page.setViewportSize({ width: 1280, height: 900 });
    for (const route of [
      '/index.html',
      '/projects.html',
      '/project.html?id=vstodo',
      '/vstodo.html',
      '/vstodo-architecture.html',
      '/updates.html',
    ]) {
      await checkAccessibility(page, route);
    }
    assert.deepEqual(pageErrors, [], 'browser runtime errors: ' + pageErrors.join('; '));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
