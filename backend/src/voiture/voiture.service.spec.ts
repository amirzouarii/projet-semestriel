import { Test, TestingModule } from '@nestjs/testing';
import { VoitureService } from './voiture.service';

describe('VoitureService', () => {
  let service: VoitureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoitureService],
    }).compile();

    service = module.get<VoitureService>(VoitureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
