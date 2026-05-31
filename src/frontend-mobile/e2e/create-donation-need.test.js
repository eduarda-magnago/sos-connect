const { device, element, by, waitFor } = require('detox');
const { login } = require('./helpers');

const EMAIL = process.env.DETOX_SU_EMAIL;
const PASSWORD = process.env.DETOX_SU_PASSWORD;

const unique = Date.now();

async function replaceEditTextAt(index, value) {
  // Prefer testID selectors when the inputs receive them in the app.
  await element(by.type('android.widget.EditText')).atIndex(index).replaceText(value);
}

(EMAIL && PASSWORD ? describe : describe.skip)('Create donation need', () => {
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

  it('creates a donation need for an owned unit', async () => {
    const itemName = `Cobertor E2E ${unique}`;

    await element(by.text('Unidades')).tap();

    await waitFor(element(by.text('Doações')).atIndex(0))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.text('Doações')).atIndex(0).tap();

    await waitFor(element(by.text('Nova necessidade')))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.text('Nova necessidade')).tap();

    await waitFor(element(by.text('Criar necessidade')))
      .toBeVisible()
      .withTimeout(5000);

    await replaceEditTextAt(0, itemName);
    await replaceEditTextAt(1, '25');
    await element(by.text('Alta')).tap();

    await element(by.text('Criar necessidade')).tap();

    await waitFor(element(by.text(itemName)))
      .toBeVisible()
      .withTimeout(15000);
  });
});
