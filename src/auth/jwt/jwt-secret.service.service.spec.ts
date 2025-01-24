import { Test, TestingModule } from '@nestjs/testing';
import { JwtSecretServiceService } from './jwt-secret.service';

describe('JwtSecretServiceService', () => {
  let service: JwtSecretServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtSecretServiceService],
    }).compile();

    service = module.get<JwtSecretServiceService>(JwtSecretServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
