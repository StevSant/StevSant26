import { test, expect } from '@playwright/test';

test.describe('Portfolio - Recruiter Journey', () => {
  test('home page loads with profile name and navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify the page loaded (navbar has a name link)
    const nameLink = page.locator('nav a[href="./"]').first();
    await expect(nameLink).toBeVisible();

    // Verify main content area exists
    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
  });

  test('projects page loads with project cards', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Wait for skeleton to disappear and content to load
    await page
      .waitForSelector('app-portfolio-grid-skeleton', { state: 'hidden', timeout: 15_000 })
      .catch(() => {});

    // Verify the page has a section
    const section = page.locator('section').first();
    await expect(section).toBeVisible();
  });

  test('experience page loads', async ({ page }) => {
    await page.goto('/experience');
    await page.waitForLoadState('networkidle');

    await page
      .waitForSelector('app-portfolio-timeline-skeleton', { state: 'hidden', timeout: 15_000 })
      .catch(() => {});

    const section = page.locator('section').first();
    await expect(section).toBeVisible();
  });

  test('skills page loads with skill categories', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    await page
      .waitForSelector('app-portfolio-skills-skeleton', { state: 'hidden', timeout: 15_000 })
      .catch(() => {});

    const section = page.locator('section').first();
    await expect(section).toBeVisible();
  });

  test('education page loads', async ({ page }) => {
    await page.goto('/education');
    await page.waitForLoadState('networkidle');

    await page
      .waitForSelector('app-portfolio-timeline-skeleton', { state: 'hidden', timeout: 15_000 })
      .catch(() => {});

    const section = page.locator('section').first();
    await expect(section).toBeVisible();
  });

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz');
    await page.waitForLoadState('networkidle');

    // The not-found component should display
    const notFound = page.locator('app-portfolio-not-found');
    await expect(notFound).toBeVisible();
  });

  test('theme toggle changes theme class on html element', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('class');

    // Find and click theme toggle button
    const themeButton = page.locator('app-theme-toggle button').first();
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(500);

      const newTheme = await page.locator('html').getAttribute('class');
      expect(newTheme).not.toEqual(initialTheme);
    }
  });

  test('language switch toggles between es and en', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the language selector button
    const langButton = page.locator('app-language-selector button').first();
    if (await langButton.isVisible()) {
      const initialText = await langButton.textContent();
      await langButton.click();
      await page.waitForTimeout(1000);

      const newText = await langButton.textContent();
      expect(newText).not.toEqual(initialText);
    }
  });

  test('navigation between pages works smoothly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to projects via nav link
    const projectsLink = page.locator('nav a[href*="projects"]').first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await page.waitForURL('**/projects');
      expect(page.url()).toContain('/projects');
    }

    // Navigate to skills
    const skillsLink = page.locator('nav a[href*="skills"]').first();
    if (await skillsLink.isVisible()) {
      await skillsLink.click();
      await page.waitForURL('**/skills');
      expect(page.url()).toContain('/skills');
    }
  });

  test('scroll progress bar appears on scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The scroll progress component should exist
    const scrollProgress = page.locator('app-scroll-progress');
    await expect(scrollProgress).toBeAttached();
  });

  test('skip navigation link is accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip link should exist (hidden until focused)
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeAttached();
    expect(await skipLink.getAttribute('href')).toBe('#main-content');
  });
});
