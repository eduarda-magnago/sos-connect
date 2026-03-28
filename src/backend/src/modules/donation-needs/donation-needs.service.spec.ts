import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DonationNeedsService } from './donation-needs.service';
import { DonationNeed } from './schemas/donation-need.schema';
import { SupportUnitsService } from '../support-units/support-units.service';

//  MOCKS (simulam banco e dependências externas)

// Simula uma unidade de apoio (como viria do banco)
const mockUnit = {
  _id: 'unt001',
  // toString é importante porque no código real o ID é um ObjectId
  support_unit_user_id: { toString: () => 'usr001' },
};

// Simula uma doação
const mockDonation = {
  _id: 'don001',
  support_unit_id: { toString: () => 'unt001' },
  item_name: 'Água mineral',
  quantity_needed: 200,
  quantity_received: 0,
  priority: 'critical',
  status: 'pending',

  // simula comportamento do mongoose.save()
  save: jest.fn().mockResolvedValue(this),
};

// Mock do Model do Mongoose (substitui o banco real)
const mockDonationModel = {
  new: jest.fn().mockResolvedValue(mockDonation),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

// Mock da service dependente
const mockSupportUnitsService = {
  findOne: jest.fn(),
};

// SUITE DE TESTES

describe('DonationNeedsService', () => {
  let service: DonationNeedsService;

  // Antes de cada teste, cria um módulo isolado com mocks
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationNeedsService,

        // Injeta o mock no lugar do Model real do Mongo
        {
          provide: getModelToken(DonationNeed.name),
          useValue: mockDonationModel,
        },

        // Injeta mock da dependência externa
        {
          provide: SupportUnitsService,
          useValue: mockSupportUnitsService,
        },
      ],
    }).compile();

    service = module.get<DonationNeedsService>(DonationNeedsService);
  });

  // Limpa mocks entre testes (evita interferência)
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste básico: garante que a service foi criada corretamente
  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // TESTES DO findAll

  describe('findAll', () => {
    it('deve retornar todas as doações', async () => {
      // Simula retorno do banco
      mockDonationModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockDonation]),
      });

      const result = await service.findAll();

      // Verifica resultado
      expect(result).toEqual([mockDonation]);

      // Verifica comportamento (se chamou o método corretamente)
      expect(mockDonationModel.find).toHaveBeenCalled();
    });
  });

  // TESTES DO findOne

  describe('findOne', () => {
    it('deve retornar uma doação quando encontrada', async () => {
      mockDonationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDonation),
      });

      const result = await service.findOne('don001');

      expect(result).toEqual(mockDonation);

      // Garante que buscou pelo ID correto
      expect(mockDonationModel.findById).toHaveBeenCalledWith('don001');
    });

    it('deve lançar NotFoundException quando não encontrada', async () => {
      mockDonationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Espera erro quando não encontra
      await expect(service.findOne('id-invalido')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // TESTES DO create

  describe('create', () => {
    it('deve lançar ForbiddenException quando usuário não é dono da unidade', async () => {
      // Simula unidade existente
      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);

      // Usuário diferente → deve bloquear
      await expect(
        service.create(
          'unt001',
          { item_name: 'Água', quantity_needed: 10 },
          'outro-usuario',
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // TESTES DO update

  describe('update', () => {
    it('deve lançar ForbiddenException quando usuário não é dono da unidade', async () => {
      mockDonationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDonation),
      });

      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);

      await expect(
        service.update(
          'don001',
          { status: 'fulfilled' as any },
          'outro-usuario',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve atualizar quando usuário é o dono', async () => {
      const updatedDonation = { ...mockDonation, status: 'fulfilled' };

      mockDonationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDonation),
      });

      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);

      // Simula atualização no banco
      mockDonationModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedDonation),
      });

      const result = await service.update(
        'don001',
        { status: 'fulfilled' as any },
        'usr001',
      );

      expect(result).toEqual(updatedDonation);

      // Garante que a atualização foi feita corretamente
      expect(mockDonationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'don001',
        { status: 'fulfilled' },
        { new: true }, // retorna atualizado
      );
    });
  });

  // TESTES DO remove

  describe('remove', () => {
    it('deve lançar ForbiddenException quando usuário não é dono da unidade', async () => {
      mockDonationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDonation),
      });

      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);

      await expect(service.remove('don001', 'outro-usuario')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve deletar quando usuário é o dono', async () => {
      mockDonationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDonation),
      });

      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);

      mockDonationModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDonation),
      });

      await expect(service.remove('don001', 'usr001')).resolves.not.toThrow();

      // Garante que deletou o ID correto
      expect(mockDonationModel.findByIdAndDelete).toHaveBeenCalledWith(
        'don001',
      );
    });
  });
});
