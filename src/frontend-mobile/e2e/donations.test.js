const { device, element, by, expect, waitFor } = require('detox');

const EMAIL = process.env.DETOX_TEST_EMAIL;
const PASSWORD = process.env.DETOX_TEST_PASSWORD;

(EMAIL && PASSWORD ? describe : describe.skip)(
  'RF06 - Visualizar pedidos de doação de unidades de apoio',
  () => {
    beforeAll(async () => {
      await device.launchApp({
        newInstance: true,
        permissions: { location: 'inuse' },
      });

      // Login com conta voluntário
      await waitFor(element(by.id('login-email-input')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('login-email-input')).typeText(EMAIL);
      await element(by.id('login-password-input')).typeText(PASSWORD);
      await element(by.id('login-submit-button')).tap();

      // Aguarda sair da tela de login
      await waitFor(element(by.id('login-submit-button')))
        .not.toBeVisible()
        .withTimeout(15000);
    });

    beforeEach(async () => {
      await device.reloadReactNative();

      // Navega até a aba de Unidades de Apoio
      await waitFor(element(by.text('Unidades de Apoio')))
        .toBeVisible()
        .withTimeout(15000);

      await element(by.text('Unidades de Apoio')).tap();

      // Abre a primeira unidade da lista
      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      // Aguarda a tela de detalhe carregar e toca em "Ver doações"
      await waitFor(element(by.id('unit-btn-donations')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('unit-btn-donations')).tap();
    });

    it('exibe a tela de necessidades de doação', async () => {
      await waitFor(element(by.text('Necessidades de doação')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe a contagem de itens cadastrados', async () => {
      await waitFor(element(by.text('Necessidades de doação')))
        .toBeVisible()
        .withTimeout(10000);

      // Verifica se aparece o texto de quantidade (ex: "8 itens cadastrados")
      await waitFor(element(by.text(/item cadastrado|itens cadastrados/)))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe cards de doação na lista', async () => {
      await waitFor(element(by.text('Necessidades de doação')))
        .toBeVisible()
        .withTimeout(10000);

      // Verifica se pelo menos o botão "Ver detalhes" do primeiro card está visível
      await waitFor(element(by.text('Ver detalhes')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('abre o detalhe de uma doação ao tocar em "Ver detalhes"', async () => {
      await waitFor(element(by.text('Ver detalhes')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.text('Ver detalhes')).atIndex(0).tap();

      await waitFor(element(by.text('Detalhes da Doação')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe o nome do item na tela de detalhe da doação', async () => {
      await element(by.text('Ver detalhes')).atIndex(0).tap();

      await waitFor(element(by.id('donation-item-name')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe o botão "Candidatar-se para doação" na tela de detalhe', async () => {
      await element(by.text('Ver detalhes')).atIndex(0).tap();

      await waitFor(element(by.id('donation-apply-btn')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('envia candidatura ao tocar em "Candidatar-se para doação"', async () => {
      await element(by.text('Ver detalhes')).atIndex(0).tap();

      await waitFor(element(by.id('donation-apply-btn')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('donation-apply-btn')).tap();

      // Verifica o alerta de sucesso
      await waitFor(element(by.text('Candidatura enviada com sucesso!')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.text('OK')).tap();
    });
  }
);