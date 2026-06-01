# Testes Unitários no Backend

## O que são Testes Unitários?

Testes unitários são testes automatizados escritos e executados para garantir que pequenas partes individuais do código (unidades) funcionem conforme esperado. No contexto do desenvolvimento backend, isso geralmente significa testar funções, métodos, ou classes de maneira isolada, sem dependências externas como bancos de dados ou serviços web.

## Por que são Importantes?

Testes unitários ajudam a:

- Identificar problemas de maneira precoce no ciclo de desenvolvimento.
- Garantir que o código continue funcionando após alterações (regressões).
- Facilitar o processo de refatoração.
- Melhorar a confiabilidade e a qualidade do software.

## Configuração do Ambiente

Para escrever testes unitários neste projeto backend (NestJS + TypeScript), siga os passos abaixo:

**1. Instale o Node.js** — o projeto usa Node com `npm`. Certifique-se de ter o Node.js instalado.

**2. Instale as dependências do projeto** — no diretório `src/backend/`, execute:

```bash
npm install
```

Isso já instala o **Jest** (framework de testes), **ts-jest** (transformador TypeScript), **@nestjs/testing** (utilitários de injeção de dependência do Nest) e **@types/jest** — todos declarados em `devDependencies` do `package.json`.

**3. Configuração do Jest** — o Jest é configurado diretamente no `package.json` do backend (`src/backend/package.json`), na chave `"jest"`:

```json
"jest": {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  "testPathIgnorePatterns": [
    "users.controller.spec.ts",
    "users.service.spec.ts",
    "auth.controller.spec.ts",
    "auth.service.spec.ts",
    "support-units.controller.spec.ts",
    "donation-needs.controller.spec.ts",
    "mission.controller.spec.ts"
  ]
}
```

Pontos-chave:

- `rootDir: "src"` — Jest procura testes dentro de `src/`.
- `testRegex: ".*\\.spec\\.ts$"` — arquivos terminados em `.spec.ts` são considerados testes, **exceto** os listados em `testPathIgnorePatterns`, que ficam temporariamente fora da execução de `npm test`.
- `transform` com `ts-jest` — permite escrever os testes diretamente em TypeScript, sem etapa manual de build.
- `collectCoverageFrom` + `coverageDirectory` — definem o escopo do relatório de cobertura (`npm run test:cov`), gerado em `src/backend/coverage/`.

**4. Estrutura de diretórios** — os arquivos de teste ficam colocalizados ao lado do código que testam, seguindo o padrão NestJS:

```
src/backend/
└── src/
    └── modules/
        └── missions/
            ├── missions.service.ts        # código
            ├── missions.service.spec.ts   # teste unitário
            ├── missions.controller.ts
            └── missions.controller.spec.ts
```

**5. Scripts disponíveis** — definidos em `package.json`:

```bash
npm test              # roda todos os testes unitários
npm run test:watch    # modo watch (reexecuta ao salvar)
npm run test:cov      # gera relatório de cobertura
npm run test:e2e      # testes end-to-end (config separada em test/jest-e2e.json)
```

## Exemplo de Teste Unitário

Como o projeto usa NestJS com Mongoose, os testes isolam a classe sob teste mockando os models do MongoDB via `getModelToken`, em vez de acessar um banco real. Veja um exemplo do `MissionsService`, que depende de dois models (`Mission` e `SupportUnit`) e aplica regras de permissão baseadas no dono da unidade de apoio:

```typescript
// src/modules/missions/missions.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { Mission } from './schemas/mission.schema';
import { SupportUnit } from '../support-units/schemas/support-unit.schema';

// Simula uma unidade de apoio vinda do banco
const mockUnit = {
  _id: 'unt001',
  support_unit_user_id: { toString: () => 'usr001' },
};

// Simula uma missão
const mockMission = {
  _id: 'mis001',
  support_unit_id: 'unt001',
  title: 'Distribuir alimentos',
  description: 'Distribuir cestas básicas para famílias afetadas',
  category: 'distribuicao',
  status: 'pending',
  volunteers_needed: 10,
  date: new Date('2026-05-01'),
  save: jest.fn().mockResolvedValue(this),
};

// Mock do Model Mission — usa jest.fn() como construtor
// para simular `new this.missionModel(...)` dentro do service
const mockMissionModel = jest.fn().mockImplementation(() => ({
  save: jest.fn().mockResolvedValue(mockMission),
}));
Object.assign(mockMissionModel, {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

// Mock do Model SupportUnit — usado para checar o dono da unidade
const mockSupportUnitModel = {
  findById: jest.fn(),
};

describe('MissionsService', () => {
  let service: MissionsService;

  // Antes de cada teste, monta o módulo do Nest injetando
  // os mocks no lugar dos models reais
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionsService,
        {
          provide: getModelToken(Mission.name),
          useValue: mockMissionModel,
        },
        {
          provide: getModelToken(SupportUnit.name),
          useValue: mockSupportUnitModel,
        },
      ],
    }).compile();

    service = module.get<MissionsService>(MissionsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    const createDto = {
      support_unit_id: 'unt001',
      title: 'Distribuir alimentos',
      description: 'Distribuir cestas básicas para famílias afetadas',
      category: 'distribuicao' as any,
      volunteers_needed: 10,
      date: '2026-05-01',
    };

    it('deve criar uma missão quando usuário é dono da unidade', async () => {
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      const result = await service.create(createDto, 'usr001');

      expect(result).toEqual(mockMission);
      expect(mockSupportUnitModel.findById).toHaveBeenCalledWith('unt001');
    });
  });
});
```
<img width="633" height="662" alt="unidade de apoio" src="https://github.com/user-attachments/assets/2f235e17-8300-4c40-8828-2ad927ecf8e2" />

<img width="638" height="620" alt="necessidade de doação" src="https://github.com/user-attachments/assets/576dcb8c-c59c-4304-9b7a-9240767d0a13" />

Pontos a observar nesse exemplo:

- **Dois models mockados simultaneamente** — `MissionsService` depende de `Mission` e `SupportUnit`; ambos são injetados via `getModelToken(...)` no `TestingModule`.
- **Mock do construtor do Model** — como o service faz `new this.missionModel(dto)`, o mock é criado como `jest.fn().mockImplementation(...)` e os métodos estáticos (`find`, `findById`, etc.) são anexados com `Object.assign`.
- **Encadeamento de métodos Mongoose** — chamadas como `find().sort().exec()` são simuladas retornando objetos com os métodos seguintes (`sort` → `exec`).
- **Regra de permissão testada isoladamente** — casos de sucesso, `NotFoundException` e `ForbiddenException` são cobertos em blocos `it` separados.

O arquivo completo, com os testes de `findOne`, `update` e `remove`, está em `src/backend/src/modules/missions/missions.service.spec.ts`.
