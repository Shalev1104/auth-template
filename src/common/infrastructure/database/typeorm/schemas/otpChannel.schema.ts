import { Entity, Index, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'otp_channels' })
@Index(['channelName'])
export class OtpChannelSchema {
  @PrimaryGeneratedColumn('increment', { name: 'channel_id' })
  channelId: number;

  @Column({ type: 'varchar', name: 'channel_name', unique: true })
  channelName: string;
}
