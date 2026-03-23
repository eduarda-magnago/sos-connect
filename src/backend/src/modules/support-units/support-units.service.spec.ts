import { Test, TestingModule } from '@nestjs/testing';
import { SupportUnitsService } from './support-units.service';

describe('SupportUnitsService', () => {
  let service: SupportUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportUnitsService],
    }).compile();

    service = module.get<SupportUnitsService>(SupportUnitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
