import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const CryptoJS = require('crypto-js');

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) {}

  async encrypt(data: string): Promise<string> {
    try {
      return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async decrypt(encrypted: string): Promise<string> {
    try {
      return CryptoJS.AES.decrypt(encrypted, this.encryptionKey).toString(
        CryptoJS.enc.Utf8,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  private get encryptionKey(): string {
    return String(this.configService.get('ENCRYPTION_KEY'));
  }
}
