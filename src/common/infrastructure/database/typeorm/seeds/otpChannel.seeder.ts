import { OtpChannelSchema } from '../schemas/otpChannel.schema';
import { OTPChannel } from '../enums/OtpChannel.enum';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class CreateChannelsSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await datasource.getRepository(OtpChannelSchema).insert(
      Object.entries(OTPChannel).map(([channelName, channelId]) => ({
        channelId,
        channelName,
      })),
    );
  }
}
