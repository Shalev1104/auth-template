import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { EmailAndPasswordLoginSchema } from './emailAndPasswordLogin.schema';
import { OAuthLoginSchema } from './oAuthLogin.schema';

@Entity({ name: 'users' })
export class UserSchema {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'last_login_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLoginAt: Date;

  @Column({ type: 'varchar', name: 'full_name' })
  name: string;

  @Column({ type: 'varchar', name: 'avatar_url', nullable: true })
  avatarImageUrl: string | null;

  @Column({ type: 'varchar', name: 'phone', nullable: true })
  phone: string | null;

  @OneToOne(() => EmailAndPasswordLoginSchema, (login) => login.user, {
    cascade: true,
    eager: true,
  })
  emailAndPasswordLogin?: EmailAndPasswordLoginSchema;

  @OneToMany(() => OAuthLoginSchema, (oauthLogin) => oauthLogin.user, {
    cascade: true,
    eager: true,
  })
  oAuthLogins: OAuthLoginSchema[];
}
