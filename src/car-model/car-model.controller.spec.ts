import { Test, TestingModule } from '@nestjs/testing';
import { CarModelController } from './car-model.controller';
import { CarModelService } from './car-model.service';

describe('CarModelController', () => {
  let controller: CarModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarModelController],
      providers: [CarModelService],
    }).compile();

    controller = module.get<CarModelController>(CarModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
