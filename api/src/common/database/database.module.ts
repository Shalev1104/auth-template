import { Module } from '@nestjs/common';
import { PostgresPrismaService } from './prisma/postgres/postgres.service';
import { MongoPrismaService } from './prisma/mongo/mongo.service';

@Module({
  providers: [PostgresPrismaService, MongoPrismaService],
})
export class DatabaseModule {}
