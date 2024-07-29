import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { OtpChannelSchema } from '../schemas/otpChannel.schema';
import CreateChannelsSeeder from '../seeds/otpChannel.seeder';
import { UserSchema } from '../schemas/user.schema';
import { OAuthLoginSchema } from '../schemas/oAuthLogin.schema';
import { VerificationSchema } from '../schemas/verifications.schema';
import { TwoFactorAuthenticationSchema } from '../schemas/twoFactorAuthentication.schema';
import { EmailAndPasswordLoginSchema } from '../schemas/emailAndPasswordLogin.schema';
import { Environment } from '../../../../../server/environment';

config();

export const entities = [
  UserSchema,
  OAuthLoginSchema,
  VerificationSchema,
  EmailAndPasswordLoginSchema,
  TwoFactorAuthenticationSchema,
  OtpChannelSchema,
];

export const datasourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities,
  seeds: [CreateChannelsSeeder],
  synchronize: Environment.Production !== process.env.NODE_ENV,
};
