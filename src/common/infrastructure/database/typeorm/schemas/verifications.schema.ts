import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { EmailAndPasswordLoginSchema } from './emailAndPasswordLogin.schema';
import { OtpChannelSchema } from './otpChannel.schema';

@Entity({ name: 'user_verifications' })
@Unique(['userId', 'channelId'])
export class VerificationSchema {
  @PrimaryColumn({ type: 'uuid', name: 'verification_id' })
  verificationId: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'number', name: 'channel_id' })
  channelId: number;

  @ManyToOne(
    () => EmailAndPasswordLoginSchema,
    (login) => login.verifications,
    { orphanedRowAction: 'delete' },
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: EmailAndPasswordLoginSchema;

  @ManyToOne(() => OtpChannelSchema, (otpChannel) => otpChannel.channelId)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'channelId' })
  channel: OtpChannelSchema;
}
