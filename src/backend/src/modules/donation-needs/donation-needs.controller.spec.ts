import { Test, TestingModule } from '@nestjs/testing';
import { DonationNeedsController } from './donation-needs.controller';

describe('DonationNeedsController', () => {
  let controller: DonationNeedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationNeedsController],
    }).compile();

    controller = module.get<DonationNeedsController>(DonationNeedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
