import { Test, TestingModule } from '@nestjs/testing';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

// Mock do service
const mockMissionsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('MissionsController', () => {
  let controller: MissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionsController],
      providers: [
        {
          provide: MissionsService,
          useValue: mockMissionsService,
        },
      ],
    }).compile();

    controller = module.get<MissionsController>(MissionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar missionsService.create com os parametros corretos', async () => {
      const createDto = {
        support_unit_id: 'unt001',
        title: 'Distribuir alimentos',
        description: 'Distribuir cestas basicas',
        category: 'distribuicao' as any,
        volunteers_needed: 10,
        date: '2026-05-01',
      };
      const mockUser = { _id: { toString: () => 'usr001' } } as any;

      mockMissionsService.create.mockResolvedValue({ _id: 'mis001', ...createDto });

      const result = await controller.create(createDto, mockUser);

      expect(result).toEqual({ _id: 'mis001', ...createDto });
      expect(mockMissionsService.create).toHaveBeenCalledWith(createDto, 'usr001');
    });
  });

  describe('findAll', () => {
    it('deve chamar missionsService.findAll com filtros', async () => {
      const mockMissions = [{ _id: 'mis001', title: 'Missao 1' }];
      mockMissionsService.findAll.mockResolvedValue(mockMissions);

      const result = await controller.findAll('unt001', 'pending', 'distribuicao');

      expect(result).toEqual(mockMissions);
      expect(mockMissionsService.findAll).toHaveBeenCalledWith({
        support_unit_id: 'unt001',
        status: 'pending',
        category: 'distribuicao',
      });
    });
  });

  describe('findOne', () => {
    it('deve chamar missionsService.findOne com o id', async () => {
      const mockMission = { _id: 'mis001', title: 'Missao 1' };
      mockMissionsService.findOne.mockResolvedValue(mockMission);

      const result = await controller.findOne('mis001');

      expect(result).toEqual(mockMission);
      expect(mockMissionsService.findOne).toHaveBeenCalledWith('mis001');
    });
  });

  describe('update', () => {
    it('deve chamar missionsService.update com os parametros corretos', async () => {
      const updateDto = { title: 'Titulo atualizado' };
      const mockUser = { _id: { toString: () => 'usr001' } } as any;
      const updatedMission = { _id: 'mis001', ...updateDto };

      mockMissionsService.update.mockResolvedValue(updatedMission);

      const result = await controller.update('mis001', updateDto, mockUser);

      expect(result).toEqual(updatedMission);
      expect(mockMissionsService.update).toHaveBeenCalledWith(
        'mis001',
        updateDto,
        'usr001',
      );
    });
  });

  describe('remove', () => {
    it('deve chamar missionsService.remove com os parametros corretos', async () => {
      const mockUser = { _id: { toString: () => 'usr001' } } as any;
      mockMissionsService.remove.mockResolvedValue(undefined);

      await controller.remove('mis001', mockUser);

      expect(mockMissionsService.remove).toHaveBeenCalledWith('mis001', 'usr001');
    });
  });
});
