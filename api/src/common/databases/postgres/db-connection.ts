import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DATABASE,
    port: +process.env.POSTGRES_PORT || 5432,
  },
});

// pg.types.setTypeParser(pg.types.builtins.INT8, parseInt);
// pg.types.setTypeParser(pg.types.builtins.FLOAT8, parseFloat);
// pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);

const dbConnection = () => knex;

export default dbConnection;

export const getPgConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASS'),
  database: configService.get('POSTGRES_DATABASE'),
  port: +configService.get('POSTGRES_PORT') || 5432,
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  ssl: configService.get('NODE_ENV') === 'production',
  synchronize: true,
  autoLoadEntities: true,
});
