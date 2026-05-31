const { element, by, waitFor } = require('detox');

/**
 * Logs in through the auth screen and waits for the form to be ready first.
 * Assumes the app was just launched (or reloaded) onto the login screen.
 */
async function login(email, password) {
  await waitFor(element(by.id('login-email-input')))
    .toBeVisible()
    .withTimeout(15000);

  await element(by.id('login-email-input')).typeText(email);
  await element(by.id('login-password-input')).typeText(password);
  await element(by.id('login-submit-button')).tap();
}

module.exports = { login };
