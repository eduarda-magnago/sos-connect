const { device, element, by, expect, waitFor } = require('detox');

const EMAIL = process.env.DETOX_TEST_EMAIL;
const PASSWORD = process.env.DETOX_TEST_PASSWORD;

describe('Login', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { location: 'inuse' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('shows the login form', async () => {
    await waitFor(element(by.id('login-email-input')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.id('login-password-input'))).toBeVisible();
    await expect(element(by.id('login-submit-button'))).toBeVisible();
  });

  it('warns when fields are empty', async () => {
    await element(by.id('login-submit-button')).tap();

    await waitFor(element(by.text('Preencha todos os campos')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.text('OK')).tap();
  });

  it('shows an error for invalid credentials', async () => {
    await element(by.id('login-email-input')).typeText('nope@example.com');
    await element(by.id('login-password-input')).typeText('wrong-password');
    await element(by.id('login-submit-button')).tap();

    await waitFor(element(by.text('Email ou senha inválidos')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.text('OK')).tap();
  });

  (EMAIL && PASSWORD ? it : it.skip)(
    'logs in with valid credentials and reaches home',
    async () => {
      await element(by.id('login-email-input')).typeText(EMAIL);
      await element(by.id('login-password-input')).typeText(PASSWORD);
      await element(by.id('login-submit-button')).tap();

      await waitFor(element(by.id('login-submit-button')))
        .not.toBeVisible()
        .withTimeout(15000);
    }
  );
});
