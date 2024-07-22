import {
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { EmailAndPasswordLoginSchema } from './emailAndPasswordLogin.schema';
import { VerificationSchema } from './verifications.schema';

@Entity({ name: 'user_two_factor_authentication' })
export class TwoFactorAuthenticationSchema {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'verification_id' })
  verificationId: string;

  @ManyToOne(
    () => VerificationSchema,
    (verification) => verification.verificationId,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'verification_id',
    referencedColumnName: 'verificationId',
  })
  verification: VerificationSchema;

  @OneToOne(
    () => EmailAndPasswordLoginSchema,
    (emailAndPasswordLogin) => emailAndPasswordLogin.twoFactorAuthentication,
  )
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'userId',
  })
  emailAndPasswordLogin: EmailAndPasswordLoginSchema;
}
