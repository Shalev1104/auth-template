import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { RequestEntity } from './requests.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'request_messages' })
export class RequestMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @Column()
  request_id: RequestEntity['request_id'];

  @Column({ type: 'varchar' })
  value: string;

  @Column()
  created_by: UserEntity['username'];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => RequestEntity, (request) => request.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.requestMessages)
  @JoinColumn({ name: 'created_by' })
  user: UserEntity;
}
