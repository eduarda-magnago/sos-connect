import { Test, TestingModule } from '@nestjs/testing';
import { DonationNeedsService } from './donation-needs.service';

describe('DonationNeedsService', () => {
  let service: DonationNeedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationNeedsService],
    }).compile();

    service = module.get<DonationNeedsService>(DonationNeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
