import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(data: string, saltCharacters = 10): Promise<string> {
    try {
      return await bcrypt.hash(data, saltCharacters);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    try {
      return await bcrypt.compare(data, hashedData);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
