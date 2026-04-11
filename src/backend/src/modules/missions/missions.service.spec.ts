import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { Mission } from './schemas/mission.schema';
import { SupportUnit } from '../support-units/schemas/support-unit.schema';

// MOCKS (simulam banco e dependencias externas)

// Simula uma unidade de apoio (como viria do banco)
const mockUnit = {
  _id: 'unt001',
  support_unit_user_id: { toString: () => 'usr001' },
};

// Simula uma missao
const mockMission = {
  _id: 'mis001',
  support_unit_id: 'unt001',
  title: 'Distribuir alimentos',
  description: 'Distribuir cestas basicas para familias afetadas',
  category: 'distribuicao',
  status: 'pending',
  volunteers_needed: 10,
  date: new Date('2026-05-01'),
  save: jest.fn().mockResolvedValue(this),
};

// Mock do Model Mission do Mongoose
const mockMissionModel = jest.fn().mockImplementation(() => ({
  save: jest.fn().mockResolvedValue(mockMission),
}));
Object.assign(mockMissionModel, {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

// Mock do Model SupportUnit do Mongoose
const mockSupportUnitModel = {
  findById: jest.fn(),
};

// SUITE DE TESTES

describe('MissionsService', () => {
  let service: MissionsService;

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // TESTES DO create

  describe('create', () => {
    const createDto = {
      support_unit_id: 'unt001',
      title: 'Distribuir alimentos',
      description: 'Distribuir cestas basicas para familias afetadas',
      category: 'distribuicao' as any,
      volunteers_needed: 10,
      date: '2026-05-01',
    };

    it('deve criar uma missao quando usuario e dono da unidade', async () => {
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      const result = await service.create(createDto, 'usr001');

      expect(result).toEqual(mockMission);
      expect(mockSupportUnitModel.findById).toHaveBeenCalledWith('unt001');
    });

    it('deve lancar NotFoundException quando unidade nao encontrada', async () => {
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.create(createDto, 'usr001')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lancar ForbiddenException quando usuario nao e dono da unidade', async () => {
      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      await expect(
        service.create(createDto, 'outro-usuario'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // TESTES DO findAll

  describe('findAll', () => {
    it('deve retornar todas as missoes sem filtros', async () => {
      (mockMissionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockMission]),
        }),
      });

      const result = await service.findAll();

      expect(result).toEqual([mockMission]);
      expect(mockMissionModel.find).toHaveBeenCalledWith({});
    });

    it('deve filtrar por support_unit_id', async () => {
      (mockMissionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockMission]),
        }),
      });

      const result = await service.findAll({ support_unit_id: 'unt001' });

      expect(result).toEqual([mockMission]);
      expect(mockMissionModel.find).toHaveBeenCalledWith({
        support_unit_id: 'unt001',
      });
    });

    it('deve filtrar por status', async () => {
      (mockMissionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockMission]),
        }),
      });

      const result = await service.findAll({ status: 'pending' });

      expect(result).toEqual([mockMission]);
      expect(mockMissionModel.find).toHaveBeenCalledWith({
        status: 'pending',
      });
    });

    it('deve filtrar por category', async () => {
      (mockMissionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockMission]),
        }),
      });

      const result = await service.findAll({ category: 'distribuicao' });

      expect(result).toEqual([mockMission]);
      expect(mockMissionModel.find).toHaveBeenCalledWith({
        category: 'distribuicao',
      });
    });

    it('deve aplicar multiplos filtros', async () => {
      (mockMissionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockMission]),
        }),
      });

      const result = await service.findAll({
        support_unit_id: 'unt001',
        status: 'pending',
        category: 'distribuicao',
      });

      expect(result).toEqual([mockMission]);
      expect(mockMissionModel.find).toHaveBeenCalledWith({
        support_unit_id: 'unt001',
        status: 'pending',
        category: 'distribuicao',
      });
    });
  });

  // TESTES DO findOne

  describe('findOne', () => {
    it('deve retornar uma missao quando encontrada', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      const result = await service.findOne('mis001');

      expect(result).toEqual(mockMission);
      expect(mockMissionModel.findById).toHaveBeenCalledWith('mis001');
    });

    it('deve lancar NotFoundException quando nao encontrada', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('id-invalido')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // TESTES DO update

  describe('update', () => {
    it('deve lancar ForbiddenException quando usuario nao e dono da unidade', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      await expect(
        service.update('mis001', { title: 'Novo titulo' }, 'outro-usuario'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lancar ForbiddenException quando unidade nao encontrada', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('mis001', { title: 'Novo titulo' }, 'usr001'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve atualizar quando usuario e o dono', async () => {
      const updatedMission = { ...mockMission, title: 'Titulo atualizado' };

      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      (mockMissionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedMission),
      });

      const result = await service.update(
        'mis001',
        { title: 'Titulo atualizado' },
        'usr001',
      );

      expect(result).toEqual(updatedMission);
      expect(mockMissionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'mis001',
        { title: 'Titulo atualizado' },
        { new: true },
      );
    });

    it('deve lancar NotFoundException quando missao nao encontrada no update', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      (mockMissionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('mis001', { title: 'Titulo' }, 'usr001'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // TESTES DO remove

  describe('remove', () => {
    it('deve lancar ForbiddenException quando usuario nao e dono da unidade', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      await expect(
        service.remove('mis001', 'outro-usuario'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lancar ForbiddenException quando unidade nao encontrada no remove', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('mis001', 'usr001')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve deletar quando usuario e o dono', async () => {
      (mockMissionModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      mockSupportUnitModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnit),
      });

      (mockMissionModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMission),
      });

      await expect(
        service.remove('mis001', 'usr001'),
      ).resolves.not.toThrow();

      expect(mockMissionModel.findByIdAndDelete).toHaveBeenCalledWith(
        'mis001',
      );
    });
  });
});
