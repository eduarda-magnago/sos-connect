const { device, element, by, waitFor } = require('detox');
const { login } = require('./helpers');

const EMAIL = process.env.DETOX_SU_EMAIL;
const PASSWORD = process.env.DETOX_SU_PASSWORD;

const unique = Date.now();

async function replaceEditTextAt(index, value) {
  // Prefer testID selectors when the inputs receive them in the app.
  await element(by.type('android.widget.EditText')).atIndex(index).replaceText(value);
}

(EMAIL && PASSWORD ? describe : describe.skip)('Create support unit', () => {
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

  it('creates a support unit', async () => {
    const unitName = `Unidade E2E ${unique}`;

    await element(by.text('Nova Unidade')).tap();

    await waitFor(element(by.text('Criar Unidade')))
      .toBeVisible()
      .withTimeout(10000);

    await replaceEditTextAt(0, unitName);
    await replaceEditTextAt(1, '-3.7319');
    await replaceEditTextAt(2, '-38.5267');
    await replaceEditTextAt(3, `unidade${unique}@e2e.com`);
    await replaceEditTextAt(4, '85999990000');
    await replaceEditTextAt(5, '12345678000199');
    await replaceEditTextAt(6, 'Unidade criada pelo teste E2E.');
    await replaceEditTextAt(7, '50');

    await element(by.text('Criar Unidade')).tap();

    await waitFor(element(by.text('Unidade criada! Aguarde a validação do admin.')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.text('OK')).tap();
  });
});
