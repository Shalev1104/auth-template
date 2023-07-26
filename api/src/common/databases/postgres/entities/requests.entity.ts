import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './users.entity';
import { TreeEntity } from './trees.entity';
import { PriorityEntity } from './priorities.entity';
import { StatusEntity } from './statuses.entity';
import { SubstatusEntity } from './sub-statuses.entity';
import { RequestAssigneeEntity } from './request-assignees.entity';
import { RequestParticipantEntity } from './request-participants.entity';
import { RequestActionEntity } from './request-actions.entity';
import { RequestOutputEntity } from './request-outputs.entity';
import { RequestFileEntity } from './request-files.entity';
import { RequestBlockedNodeEntity } from './request-blocked-nodes.entity';
import { RequestMessageEntity } from './request-messages.entity';
import { Uuid } from 'src/common/domain/uuid';

@Entity({ name: 'requests' })
export class RequestEntity {
  @PrimaryGeneratedColumn('uuid')
  request_id: Uuid;

  @Column({ type: 'varchar', length: 32 })
  title: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  description: string;

  @Column()
  priority_id: PriorityEntity['priority_id'];

  @Column()
  status_id: StatusEntity['status_id'];

  @Column({ nullable: true })
  substatus_id: SubstatusEntity['substatus_id'];

  @Column()
  created_by: UserEntity['username'];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  tree_id: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  tree_version: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  node_id: string;

  @Column({ type: 'boolean', default: false })
  is_finished: string;

  @Column()
  modified_by: UserEntity['username'];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  modified_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.requestsCreatedBy)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.requestsModifiedBy)
  @JoinColumn({ name: 'modified_by' })
  modifiedBy: UserEntity;

  @ManyToOne(() => TreeEntity, (tree) => tree.requests)
  @JoinColumn({ name: 'tree_id' })
  tree: TreeEntity;

  @OneToMany(() => RequestAssigneeEntity, (assignee) => assignee.user)
  assignees: RequestAssigneeEntity[];

  @OneToMany(() => RequestParticipantEntity, (participant) => participant.user)
  participants: RequestParticipantEntity[];

  @OneToMany(() => RequestMessageEntity, (message) => message.request)
  messages: RequestAssigneeEntity[];

  @OneToMany(() => RequestActionEntity, (action) => action.request)
  actions: RequestActionEntity[];

  @OneToMany(
    () => RequestBlockedNodeEntity,
    (blockedNode) => blockedNode.request,
  )
  blockedNodes: RequestBlockedNodeEntity[];

  @OneToMany(() => RequestFileEntity, (file) => file.request)
  files: RequestFileEntity[];

  @OneToMany(() => RequestOutputEntity, (output) => output.request)
  outputs: RequestOutputEntity[];

  @ManyToOne(() => PriorityEntity, (priority) => priority.requests)
  @JoinColumn({ name: 'priority_id' })
  priority: PriorityEntity;

  @ManyToOne(() => StatusEntity, (status) => status.requests)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @ManyToOne(() => SubstatusEntity, (substatus) => substatus.requests, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn([
    { name: 'status_id', referencedColumnName: 'status_id' },
    { name: 'substatus_id', referencedColumnName: 'substatus_id' },
  ])
  substatus: SubstatusEntity;
}
