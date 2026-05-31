const { device, element, by, expect, waitFor } = require('detox');
const { login } = require('./helpers');

const EMAIL = process.env.DETOX_SU_EMAIL;
const PASSWORD = process.env.DETOX_SU_PASSWORD;

(EMAIL && PASSWORD ? describe : describe.skip)('Create a new mission', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { location: 'inuse' },
    });

    await login(EMAIL, PASSWORD);

    // Wait for the authenticated area (Dashboard) before navigating.
    await waitFor(element(by.id('dashboard-filter-button')))
      .toBeVisible()
      .withTimeout(20000);
  });

  it('creates a mission for an owned unit', async () => {
    // Go to the "Unidades" tab.
    await element(by.id('tab-support-units')).tap();
    await waitFor(element(by.text('Missão')).atIndex(0))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.text('Missão')).atIndex(0).tap();

    await waitFor(element(by.id('mission-create-fab')))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id('mission-create-fab')).tap();

    await waitFor(element(by.id('mission-submit-button')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('mission-title-input')).replaceText('Missão E2E');
    await element(by.id('mission-description-input')).replaceText(
      'Missão criada por teste automatizado Detox.'
    );
    await element(by.id('mission-volunteers-input')).replaceText('3');

    await element(by.id('mission-category-limpeza')).tap();

    await element(by.id('mission-date-input')).tap();
    await element(by.text('OK')).tap();

    await element(by.id('mission-submit-button')).tap();

    await waitFor(element(by.id('mission-submit-button')))
      .not.toBeVisible()
      .withTimeout(15000);
    await expect(element(by.text('Missão E2E')).atIndex(0)).toBeVisible();
  });
});
