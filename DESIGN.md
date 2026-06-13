# SOS Connect Design System

## Direcao

SOS Connect usa uma linguagem de "humanitario moderno": confiavel, clara, acolhedora e rapida de entender em momentos de urgencia.

## Principios

- Clareza antes de decoracao: cada tela deve deixar a acao principal evidente.
- Pouca friccao: filtros, mapas e cards devem ser compactos e faceis de escanear.
- Hierarquia calma: azul escuro para estrutura e confianca, vermelho para acoes importantes.
- Informacao util: imagens, vagas, status, contato e servicos devem aparecer sem poluir a tela.
- Consistencia mobile: navegacao fixa, areas seguras respeitadas e componentes previsiveis.

## Cores

- Primaria: `colors.primary` / `colors.sidebar` para cabecalho, tab bar e elementos estruturais.
- Acao: `colors.action` para chamadas importantes, badges ativos e botao central de criar.
- Fundo: `colors.background` para telas.
- Superficie: `colors.card` para cards e sheets.
- Texto: `colors.foreground` para titulos e `colors.muted` para apoio.
- Status: `success`, `warning` e `danger` apenas para disponibilidade e alertas.

## Tipografia

- Titulos compactos com `fonts.bold`.
- Rotulos e metadados com `fonts.medium` ou `fonts.semibold`.
- Texto auxiliar pequeno, com boa legibilidade, usando `fonts.regular`.

## Home

- Cabecalho compacto com saudacao e contexto do usuario.
- Barra de filtros simples, com contador discreto apenas quando houver filtros ativos.
- Mapa preservado como area principal de localizacao.
- Lista de unidades proximas com imagem, status, vagas e servicos.
- Sem cards de metricas acima do mapa.

## Navegacao Inferior

- Fixa, integrada ao app e respeitando safe area.
- Azul escuro como o cabecalho.
- Texto curto apenas no item ativo para equilibrar clareza e leveza.
- Botao central de criar destacado em vermelho, pequeno e integrado a barra.
- Telas com formulario, lista ou detalhe devem usar `paddingBottom` suficiente para que a tab bar nao cubra a ultima acao.

## Componentes

- Cards com borda sutil, raio consistente e sombra leve.
- Chips arredondados, compactos e com estado ativo evidente.
- Badges pequenos, com ponto de status e contraste suficiente.
- Icones Ionicons para informacoes recorrentes, evitando emojis na interface.

## Fora de Escopo Nesta Iteracao

- Rotas, regras de perfil e permissao.
- Integracao de mapa, localizacao e marcadores.
- Backend, contratos de API, `services/api.ts` e contexto de autenticacao.
