import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { TreeMemberEntity } from './tree-members.entity';
import { RequestEntity } from './requests.entity';
import { RequestAssigneeEntity } from './request-assignees.entity';
import { RequestParticipantEntity } from './request-participants.entity';
import { RequestActionEntity } from './request-actions.entity';
import { RequestFileEntity } from './request-files.entity';
import { RequestMessageEntity } from './request-messages.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  authStrategy?: string;

  @OneToMany(() => RequestMessageEntity, (message) => message.user)
  requestMessages: RequestMessageEntity[];

  @OneToMany(() => RequestAssigneeEntity, (assignee) => assignee.user)
  requestAssignees: RequestAssigneeEntity[];

  @OneToMany(() => RequestParticipantEntity, (participant) => participant.user)
  requestParticipants: RequestParticipantEntity[];

  @OneToMany(() => RequestActionEntity, (action) => action.user)
  requestActions: RequestActionEntity[];

  @OneToMany(() => RequestFileEntity, (file) => file.uploadedBy)
  requestFiles: RequestFileEntity[];

  @OneToMany(() => TreeMemberEntity, (treeMember) => treeMember.user)
  treeMembers: TreeMemberEntity[];

  @OneToMany(() => RequestEntity, (request) => request.createdBy)
  requestsCreatedBy: RequestEntity[];

  @OneToMany(() => RequestEntity, (request) => request.modifiedBy)
  requestsModifiedBy: RequestEntity[];
}
