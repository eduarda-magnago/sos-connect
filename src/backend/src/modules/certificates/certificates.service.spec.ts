import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { Certificate } from './schemas/certificate.schema';
import { MissionsService } from '../missions/missions.service';
import { SupportUnitsService } from '../support-units/support-units.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';

//  MOCKS (simulam banco e dependências externas)

// IDs em formato ObjectId válido (24 hex) para Types.ObjectId no service
const ID_UNIT = '507f1f77bcf86cd799439011';
const ID_USER_GESTOR = '507f1f77bcf86cd799439012';
const ID_USER_VOL = '507f1f77bcf86cd799439013';
const ID_MISSION = '507f1f77bcf86cd799439014';
const ID_CERT = '507f1f77bcf86cd799439015';

// Simula unidade de apoio (como viria do banco)
const mockUnit = {
  _id: ID_UNIT,
  name: 'Abrigo Centro',
  
  support_unit_user_id: { toString: () => ID_USER_GESTOR },
};

// Simula missão com voluntários inscritos
const mockMission = {
  _id: ID_MISSION,
  title: 'Distribuir água',
  support_unit_id: { toString: () => ID_UNIT },
  volunteer_ids: [{ toString: () => ID_USER_VOL }],
};

// Simula usuário voluntário
const mockVolunteer = {
  _id: ID_USER_VOL,
  name: 'Maria Voluntária',
};

// Simula certificado persistido
const mockCertificate = {
  _id: ID_CERT,
  user_id: { toString: () => ID_USER_VOL },
  mission_id: { toString: () => ID_MISSION },
  support_unit_id: { toString: () => ID_UNIT },
  issued_by: { toString: () => ID_USER_GESTOR },
  hours: 8,
  certificate_code: 'CERT-2026-ABCD12',
  issued_at: new Date('2026-04-01T12:00:00Z'),
};

// Mock do Model do Mongoose
type MockCertificateModel = jest.Mock & {
  findOne: jest.Mock;
  find: jest.Mock;
  findById: jest.Mock;
};

const mockCertificateModel = Object.assign(
  jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(mockCertificate),
  })),
  {
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
) as MockCertificateModel;

// Mocks das services dependentes
const mockMissionsService = {
  findOne: jest.fn(),
};

const mockSupportUnitsService = {
  findOne: jest.fn(),
};

const mockUsersService = {
  findOne: jest.fn(),
};

// SUITE DE TESTES

describe('CertificatesService', () => {
  let service: CertificatesService;

  // Antes de cada teste, cria um módulo isolado com mocks
  beforeEach(async () => {
    mockCertificateModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockCertificate),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,

        {
          provide: getModelToken(Certificate.name),
          useValue: mockCertificateModel,
        },

        {
          provide: MissionsService,
          useValue: mockMissionsService,
        },

        {
          provide: SupportUnitsService,
          useValue: mockSupportUnitsService,
        },

        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
  });

  // Limpa mocks entre testes (evita interferência)
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste básico: garante que a service foi criada corretamente
  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // TESTES DO create

  describe('create', () => {
    const createDto = {
      mission_id: ID_MISSION,
      volunteer_user_id: ID_USER_VOL,
      hours: 8,
    };

    it('deve lançar ForbiddenException quando emissor não é dono da unidade', async () => {
      mockMissionsService.findOne.mockResolvedValue(mockMission);
      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);

      await expect(
        service.create(createDto, 'outro-usuario'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve criar certificado quando gestor é dono e voluntário está na missão', async () => {
      mockMissionsService.findOne.mockResolvedValue(mockMission);
      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);
      mockUsersService.findOne.mockResolvedValue(mockVolunteer);
      mockCertificateModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.create(createDto, ID_USER_GESTOR);

      expect(mockMissionsService.findOne).toHaveBeenCalledWith(ID_MISSION);
      expect(mockSupportUnitsService.findOne).toHaveBeenCalledWith(ID_UNIT);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(ID_USER_VOL);
      expect(result).toEqual(mockCertificate);
      expect(mockCertificateModel).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: ID_USER_VOL,
          mission_id: ID_MISSION,
          issued_by: ID_USER_GESTOR,
          hours: 8,
        }),
      );
    });

    it('deve retornar certificado existente quando já houver para missão e voluntário', async () => {
      const existente = {
        ...mockCertificate,
        _id: '507f1f77bcf86cd799439099',
      };
      mockMissionsService.findOne.mockResolvedValue(mockMission);
      mockSupportUnitsService.findOne.mockResolvedValue(mockUnit);
      mockUsersService.findOne.mockResolvedValue(mockVolunteer);
      mockCertificateModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existente),
      });

      const result = await service.create(createDto, ID_USER_GESTOR);

      expect(result).toEqual(existente);
      expect(mockCertificateModel).not.toHaveBeenCalled();
    });
  });

  

  // TESTES DO findOneForUser

  describe('findOneForUser', () => {
    it('deve retornar certificado quando usuário é o dono', async () => {
      mockCertificateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCertificate),
      });

      const result = await service.findOneForUser(
        ID_CERT,
        ID_USER_VOL,
        UserRole.VOLUNTEER,
      );

      expect(result).toEqual(mockCertificate);
      expect(mockCertificateModel.findById).toHaveBeenCalledWith(ID_CERT);
    });

    it('deve lançar NotFoundException quando certificado não existe', async () => {
      mockCertificateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOneForUser(
          '507f1f77bcf86cd7994390ff',
          ID_USER_VOL,
          UserRole.VOLUNTEER,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException quando usuário não é dono nem admin', async () => {
      mockCertificateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCertificate),
      });

      await expect(
        service.findOneForUser(
          ID_CERT,
          '507f1f77bcf86cd7994390aa',
          UserRole.VOLUNTEER,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve permitir acesso quando usuário é admin', async () => {
      mockCertificateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCertificate),
      });

      const result = await service.findOneForUser(
        ID_CERT,
        '507f1f77bcf86cd7994390bb',
        UserRole.ADMIN,
      );

      expect(result).toEqual(mockCertificate);
    });
  });

  

  
});
