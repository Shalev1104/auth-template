import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { ActionsTypesEntity } from './actions-types.entity';
import { RequestEntity } from './requests.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'request_actions' })
export class RequestActionEntity {
  @PrimaryGeneratedColumn('uuid')
  action_id: string;

  @Column()
  request_id: RequestEntity['request_id'];

  @Column()
  type_id: ActionsTypesEntity['type_id'];

  @Column({ type: 'varchar' })
  value: string;

  @Column({ nullable: true })
  created_by: UserEntity['username'];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => RequestEntity, (request) => request.actions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;

  @ManyToOne(() => ActionsTypesEntity, (action) => action.types)
  @JoinColumn({ name: 'type_id' })
  action_type: ActionsTypesEntity;

  @ManyToOne(() => UserEntity, (user) => user.requestActions)
  @JoinColumn({ name: 'created_by' })
  user: UserEntity;
}
