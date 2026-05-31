const { device, element, by, expect, waitFor } = require('detox');

const EMAIL = process.env.DETOX_TEST_EMAIL;
const PASSWORD = process.env.DETOX_TEST_PASSWORD;

(EMAIL && PASSWORD ? describe : describe.skip)(
  'RF09 - Consultar informações detalhadas de unidade de apoio',
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
    });

    it('exibe a lista de unidades de apoio', async () => {
      await waitFor(element(by.text('Unidades de Apoio')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('abre o detalhe de uma unidade ao tocar nela', async () => {
      // Toca na primeira unidade da lista
      await waitFor(element(by.text('Detalhe da Unidade')))
        .not.toBeVisible()
        .withTimeout(5000);

      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      await waitFor(element(by.text('Detalhe da Unidade')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe a capacidade da unidade', async () => {
      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      await waitFor(element(by.id('unit-capacity')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe a ocupação da unidade', async () => {
      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      await waitFor(element(by.id('unit-occupancy')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe a seção de serviços disponíveis', async () => {
      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      await waitFor(element(by.id('unit-services-title')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe o botão "Ver doações" para voluntário', async () => {
      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      await waitFor(element(by.id('unit-btn-donations')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe o botão "Participar de missão" para voluntário', async () => {
      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      await waitFor(element(by.id('unit-btn-missions')))
        .toBeVisible()
        .withTimeout(10000);
    });

    it('exibe o botão "Ver rota" para voluntário', async () => {
      const firstUnit = element(by.type('TouchableOpacity')).atIndex(0);
      await firstUnit.tap();

      await waitFor(element(by.id('unit-btn-route')))
        .toBeVisible()
        .withTimeout(10000);
    });
  }
);