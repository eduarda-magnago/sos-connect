# Testes E2E (Detox)

Testes de ponta a ponta do app mobile, executados com o
[Detox](https://wix.github.io/Detox/) em um **emulador Android**.

> Este é um projeto **Expo gerenciado** (a pasta `android/` não é versionada),
> então o Detox precisa do projeto nativo gerado via `expo prebuild` antes de
> conseguir compilar.

## Configuração inicial (uma única vez)

1. Instale as dependências (adiciona `detox`, `jest`, `@config-plugins/detox`):

   ```bash
   npm install
   ```

2. Instale o CLI do Detox:

   ```bash
   npm install -g detox-cli
   ```

3. Crie um emulador Android (AVD), caso ainda não tenha, e garanta que o nome
   dele corresponde a `devices.emulator.device.avdName` no `.detoxrc.js`
   (atualmente `Pixel_8_Pro_API_35`). Liste os AVDs existentes com:

   ```bash
   emulator -list-avds
   ```

4. Gere o projeto nativo (refaça sempre que a configuração nativa mudar):

   ```bash
   npx expo prebuild --platform android
   ```

## Executando

```bash
# Inicie o emulador primeiro (ou deixe o Detox subir um), depois:
npm run e2e:build
npm run e2e:test
```

### Rodando no Windows

O Detox para **Android** funciona no Windows (apenas o runner de iOS exige macOS).
A única diferença é que o `cmd.exe` não aceita `./gradlew` — então existe uma
configuração separada que usa `gradlew` (`gradlew.bat`). No Windows, use os
scripts `:win`:

```bash
npm run e2e:build:win
npm run e2e:test:win
```

Pré-requisitos no Windows: Node.js, JDK 17, Android SDK + um AVD, e as variáveis
`ANDROID_HOME` / `ANDROID_SDK_ROOT` definidas. O `expo prebuild --platform android`
e tudo mais funciona igual ao macOS/Linux.

## O teste de login (`login.test.js`)

- ✅ exibe o formulário de login
- ✅ avisa quando os campos estão vazios
- ✅ mostra erro para credenciais inválidas
- ⏭️ faz login com credenciais válidas (ignorado a menos que você forneça
  credenciais reais):

  ```bash
  DETOX_TEST_EMAIL=voce@exemplo.com DETOX_TEST_PASSWORD=senha npm run e2e:test
  ```

O teste do caminho feliz acessa o backend real (`sos-connect-api.onrender.com`),
então precisa de acesso à rede e de uma conta válida.

## O teste de filtro do dashboard (`dashboard-filter.test.js`)

Faz login, abre o painel **Filtros** no Dashboard, aplica um filtro de status e
verifica se o selo de filtro ativo / o botão "Limpar" aparecem, e depois limpa.
Precisa de uma conta válida (qualquer perfil):

```bash
DETOX_TEST_EMAIL=voce@exemplo.com DETOX_TEST_PASSWORD=senha npm run e2e:test
```

A suíte inteira é ignorada se essas variáveis de ambiente não estiverem
definidas.

## O teste de criação de missão (`create-mission.test.js`)

Faz login, vai até **Unidades**, abre a tela de missões de uma unidade própria,
toca em **Nova missão**, preenche o formulário e verifica se a missão é criada.

Requer uma **conta `support_unit` que já seja dona de uma unidade** (o botão
"Missão" e o FAB só aparecem para os donos). Forneça credenciais específicas:

```bash
DETOX_SU_EMAIL=unidade@exemplo.com DETOX_SU_PASSWORD=senha npm run e2e:test
```

Observações:
- Ele acessa o backend real, então cada execução cria uma missão de verdade
  (com o título `Missão E2E`) naquela unidade.
- O campo de data abre o **seletor de data nativo do Android**; o teste toca em
  `OK` para confirmar a data atual, o que pode ser instável entre diferentes
  versões de API do emulador.

---

## Como adicionar um novo teste

Três passos: **(1)** dê `testID`s aos elementos, **(2)** escreva um arquivo
`*.test.js`, **(3)** execute. Abaixo, um passo a passo usando
**"filtrar unidades de apoio"** como exemplo.

### 1. Adicione `testID`s aos elementos que você vai acionar/verificar

O Detox encontra elementos pelo `testID` (`by.id(...)`). Adicione onde estiver
faltando. Para a busca/filtro de unidades de apoio:

```tsx
// components/support-units/SearchBar.tsx — adicione uma prop testID e repasse-a
<TextInput testID={testID} ... />

// app/(app)/support-units.tsx — conecte
<SearchBar testID="support-units-search" value={search} onChangeText={setSearch} />

// components/support-units/SupportUnitCard.tsx — torne cada card localizável
<TouchableOpacity testID={`support-unit-card-${unit._id}`} ... />
```

> Dica: prefira IDs estáveis e únicos (`support-unit-card-<id>`). Para verificar
> um texto que você não controla por ID, `by.text('Algum rótulo')` também
> funciona.

### 2. Escreva o arquivo de teste

Crie `e2e/support-units.test.js`. A tela fica atrás da autenticação (grupo
`(app)`), então o teste faz login primeiro e depois exercita o filtro:

```js
const { device, element, by, expect, waitFor } = require('detox');

const EMAIL = process.env.DETOX_TEST_EMAIL;
const PASSWORD = process.env.DETOX_TEST_PASSWORD;

(EMAIL && PASSWORD ? describe : describe.skip)('Filtrar unidades de apoio', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, permissions: { location: 'inuse' } });

    // Faça login para chegar à área autenticada.
    await element(by.id('login-email-input')).typeText(EMAIL);
    await element(by.id('login-password-input')).typeText(PASSWORD);
    await element(by.id('login-submit-button')).tap();

    // Navegue até a aba de Unidades (ajuste o matcher ao rótulo da sua aba).
    await waitFor(element(by.text('Unidades de Apoio')))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('filtra a lista conforme você digita na barra de busca', async () => {
    await element(by.id('support-units-search')).typeText('Abrigo');

    // Uma unidade correspondente continua visível...
    await waitFor(element(by.text('Abrigo Central')))
      .toBeVisible()
      .withTimeout(5000);

    // ...e uma que não corresponde some.
    await expect(element(by.text('Posto Médico Norte'))).not.toBeVisible();
  });
});
```

### 3. Execute

```bash
DETOX_TEST_EMAIL=voce@exemplo.com DETOX_TEST_PASSWORD=senha npm run e2e:test
```

O Detox executa todos os `e2e/**/*.test.js`, então o novo arquivo é detectado
automaticamente.

> **Atenção (Android):** use `replaceText('...')` em vez de `typeText('...')` ao
> preencher campos com caracteres acentuados (ex.: "Missão"). O IME do Android
> não consegue traduzir acentos em eventos de tecla para o `typeText`.

### Folha de consulta

| Necessidade | Código |
|------|------|
| Localizar por testID | `element(by.id('meu-id'))` |
| Localizar por texto visível | `element(by.text('Entrar'))` |
| Tocar | `.tap()` |
| Digitar | `.typeText('olá')` |
| Definir texto (acentos/Android) | `.replaceText('Missão')` |
| Limpar um campo | `.clearText()` |
| Rolar até aparecer | `.scrollTo('bottom')` / `waitFor(...).whileElement(...)` |
| Verificar visível | `await expect(el).toBeVisible()` |
| Verificar oculto | `await expect(el).not.toBeVisible()` |
| Aguardar UI assíncrona | `await waitFor(el).toBeVisible().withTimeout(ms)` |

Consulte a [documentação da API do Detox](https://wix.github.io/Detox/docs/api/matchers)
para a referência completa de matchers/ações/verificações.