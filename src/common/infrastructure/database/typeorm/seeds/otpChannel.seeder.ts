import { OtpChannelSchema } from '../schemas/otpChannel.schema';
import { OTPChannel } from '../enums/OtpChannel.enum';
import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';

export default class CreateChannels implements Seeder {
  public async run(factory: Factory, datasource: DataSource): Promise<void> {
    await datasource
      .createQueryBuilder()
      .insert()
      .into(OtpChannelSchema)
      .values(
        Object.entries(OTPChannel).map(([channelName, channelId]) => ({
          channelId,
          channelName,
        })),
      )
      .execute();
  }
}
