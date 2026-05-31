const { device, element, by, expect, waitFor } = require('detox');
const { login } = require('./helpers');

const EMAIL = process.env.DETOX_TEST_EMAIL;
const PASSWORD = process.env.DETOX_TEST_PASSWORD;

(EMAIL && PASSWORD ? describe : describe.skip)(
  'Dashboard — filter support units',
  () => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        permissions: { location: 'inuse' },
      });

      await login(EMAIL, PASSWORD);

      await waitFor(element(by.id('dashboard-filter-button')))
        .toBeVisible()
        .withTimeout(20000);
    });

    it('applies a status filter and shows it as active', async () => {
      await element(by.id('dashboard-filter-button')).tap();

      await waitFor(element(by.id('map-filter-status-open')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('map-filter-status-open')).tap();
      await element(by.id('map-filters-apply')).tap();

      await waitFor(element(by.id('dashboard-filter-badge')))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('dashboard-filter-clear'))).toBeVisible();
      await expect(element(by.text('1'))).toBeVisible();
    });

    it('clears the active filter', async () => {
      await element(by.id('dashboard-filter-clear')).tap();
      await waitFor(element(by.id('dashboard-filter-badge')))
        .not.toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('dashboard-filter-clear'))).not.toBeVisible();
    });
  }
);
