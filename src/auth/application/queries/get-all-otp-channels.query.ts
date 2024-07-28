import { OtpChannelSchema } from '@common/infrastructure/database/typeorm/schemas/otpChannel.schema';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

export class GetAllOtpChannelsQuery implements IQuery {}

@QueryHandler(GetAllOtpChannelsQuery)
export class GetAllOtpChannelsQueryHandler
  implements IQueryHandler<GetAllOtpChannelsQuery>
{
  constructor(private readonly datasource: DataSource) {}

  async execute() {
    return this.datasource
      .createQueryBuilder(OtpChannelSchema, 'otp_channels')
      .orderBy('otp_channels.channel_id', 'ASC')
      .getMany();
  }
}
