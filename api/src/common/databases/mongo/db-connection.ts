import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const getMongoConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => ({
  uri: configService.get('MONGO_URI'),
  dbName: configService.get('MONGO_DATABASE'),
});
