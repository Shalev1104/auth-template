import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TwoFactorAuthenticationSchema } from './twoFactorAuthentication.schema';
import { UserSchema } from './user.schema';
import { VerificationSchema } from './verifications.schema';

@Entity({ name: 'user_login' })
@Index(['emailAddress'])
export class EmailAndPasswordLoginSchema {
  @PrimaryGeneratedColumn('uuid', { name: 'login_id' })
  loginId: string;

  @Column('uuid', { name: 'user_id', unique: true })
  userId: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  emailAddress: string;

  @Column({ type: 'varchar', name: 'password', length: 64 })
  hashedPassword: string;

  @Column({
    type: 'varchar',
    name: 'totp_shared_secret',
    unique: true,
    nullable: true,
  })
  totpSharedSecret: string | null;

  @OneToOne(() => UserSchema, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @OneToMany(() => VerificationSchema, (verifications) => verifications.user, {
    cascade: true,
    eager: true,
  })
  verifications: VerificationSchema[];

  @OneToOne(
    () => TwoFactorAuthenticationSchema,
    (twoFactorAuthentication) => twoFactorAuthentication.emailAndPasswordLogin,
    { cascade: true, eager: true },
  )
  twoFactorAuthentication?: TwoFactorAuthenticationSchema;
}
