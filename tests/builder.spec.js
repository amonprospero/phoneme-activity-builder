import { test, expect } from '@playwright/test';

test('builder CRUD: create an activity set and add a phoneme word', async ({ page }) => {
  await page.goto('/words');
  await expect(page.getByRole('heading', { name: /word lists/i })).toBeVisible();

  const title = `Playwright set ${Date.now()}`;
  await page.getByTestId('set-title').fill(title);
  await page.getByTestId('save-set').click();
  await expect(page.getByText(/activity set created/i)).toBeVisible();

  await page.getByTestId('word-english').fill('chin');
  await page.getByTestId('word-phonemes').fill('tʃ ɪ n');
  await page.getByTestId('save-word').click();
  await expect(page.getByText(/word added/i)).toBeVisible();
  await expect(page.getByText('chin')).toBeVisible();
});

test('user use case: generate a Wordle HTML activity', async ({ page }) => {
  await page.goto('/wordle');
  await expect(page.getByRole('heading', { name: /wordle builder/i })).toBeVisible();
  await page.locator('#phonemeWord').fill('ʃ ɪ p');
  await page.locator('#englishWord').fill('ship');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('generate-wordle').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/phonemele/i);
});

test('health endpoint returns 200', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBeTruthy();
});
