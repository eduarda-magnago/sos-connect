import { Test, TestingModule } from '@nestjs/testing';
import { SupportUnitsController } from './support-units.controller';

describe('SupportUnitsController', () => {
  let controller: SupportUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportUnitsController],
    }).compile();

    controller = module.get<SupportUnitsController>(SupportUnitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
