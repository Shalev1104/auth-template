import {
  Entity,
  Index,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserSchema } from './user.schema';
import { OAuthProvider } from '../enums/OAuthProvider.enum';

@Entity({ name: 'user_oauth_logins' })
@Index(['emailAddress'])
export class OAuthLoginSchema {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn({
    type: 'enum',
    enum: OAuthProvider,
    name: 'provider_name',
    enumName: 'oauth_providers',
  })
  providerName: OAuthProvider;

  @Column({ type: 'varchar', name: 'provider_id', unique: true })
  providerId: string;

  @Column({ type: 'varchar', length: 255, name: 'email', nullable: true })
  emailAddress: string | null;

  @ManyToOne(() => UserSchema, (user) => user.oAuthLogins, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;
}
