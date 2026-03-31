import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupportUnitsService } from './support-units.service';
import { SupportUnit } from './schemas/support-unit.schema';
import { SupportUnitsModule } from './support-units.module';

// MOCKS (simulam comportamento do banco)

// Objeto que representa uma unidade vinda do banco
// Contém dados realistas para testar regras de negócio
const mockSupportUnit = {
  _id: '69c0c323a96d86bc03feb7b8',
  support_unit_user_id: 'usr001', // usado para validação de permissão
  name: 'Abrigo Centro',
  CNPJ: '12.345.678/0001-99',
  description: 'Centro de apoio',
  contact: { email: 'abrigo@email.com', phone: '(85) 99999-0000' },
  location: { type: 'Point', coordinates: [-38.5433, -3.7172] },
  capacity: 150,
  current_occupancy: 0,
  services_available: ['água', 'alimentação'],
  status: 'open',
  validated: true,

  // simula persistência no banco
  save: jest.fn().mockResolvedValue(this),
};

// Mock do model do Mongoose

// Aqui interceptamos chamadas ao "banco"
const mockSupportUnitModel = {
  new: jest.fn().mockResolvedValue(mockSupportUnit),
  constructor: jest.fn().mockResolvedValue(mockSupportUnit),
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
  exec: jest.fn(),
};

describe('SupportUnitsService', () => {
  let service: SupportUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportUnitsService,

        // Injeta o mock no lugar do model real
        {
          provide: getModelToken(SupportUnit.name),
          useValue: mockSupportUnitModel,
        },
      ],
    }).compile();

    service = module.get<SupportUnitsService>(SupportUnitsService);
  });

  // Evita que um teste influencie outro
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste básico de sanidade
  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });


  // findOne → busca por ID

  describe('findOne', () => {
    it('deve retornar uma unidade quando encontrada', async () => {
      // Simula retorno do banco
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSupportUnit),
      });

      const result = await service.findOne('69c0c323a96d86bc03feb7b8');

      // Verifica retorno
      expect(result).toEqual(mockSupportUnit);

      // Garante que buscou pelo ID correto
      expect(mockSupportUnitModel.findById).toHaveBeenCalledWith('69c0c323a96d86bc03feb7b8');
    });

    it('deve lançar NotFoundException quando não encontrada', async () => {
      // Simula "não encontrado"
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Espera erro da service
      await expect(service.findOne('id-invalido')).rejects.toThrow(NotFoundException);
    });
  });


  // findAll → retorna apenas unidades validadas

  describe('findAll', () => {
    it('deve retornar apenas unidades validadas', async () => {
      mockSupportUnitModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockSupportUnit]),
      });

      const result = await service.findAll();

      expect(result).toEqual([mockSupportUnit]);

      // Garante que o filtro de validação foi aplicado
      expect(mockSupportUnitModel.find).toHaveBeenCalledWith({ validated: true });
    });
  });


  //  validate → altera status de validação

  describe('validate', () => {
    it('deve aprovar uma unidade', async () => {
      // unidade inicialmente não validada
      const unit = {
        ...mockSupportUnit,
        validated: false,
        save: jest.fn().mockResolvedValue({ ...mockSupportUnit, validated: true }),
      };

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(unit),
      });

      await service.validate('69c0c323a96d86bc03feb7b8', true);

      // Verifica se persistiu alteração
      expect(unit.save).toHaveBeenCalled();

      // Estado final esperado
      expect(unit.validated).toBe(true);
    });

    it('deve rejeitar uma unidade', async () => {
      const unit = {
        ...mockSupportUnit,
        validated: true,
        save: jest.fn().mockResolvedValue({ ...mockSupportUnit, validated: false }),
      };

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(unit),
      });

      await service.validate('69c0c323a96d86bc03feb7b8', false);

      expect(unit.validated).toBe(false);
    });
  });


  // remove → regra de permissão + deleção

  describe('remove', () => {
    it('deve lançar ForbiddenException quando usuário não é o dono', async () => {
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSupportUnit),
      });

      // Usuário diferente → deve bloquear
      await expect(
        service.remove('69c0c323a96d86bc03feb7b8', 'outro-usuario-id'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve deletar quando usuário é o dono', async () => {
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSupportUnit),
      });

      mockSupportUnitModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSupportUnit),
      });

      // Dono correto → operação permitida
      await expect(
        service.remove('69c0c323a96d86bc03feb7b8', 'usr001'),
      ).resolves.not.toThrow();
    });
  });
});