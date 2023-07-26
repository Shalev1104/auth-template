import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './users.entity';
import { RequestEntity } from './requests.entity';

@Entity({ name: 'request_assignees' })
export class RequestAssigneeEntity {
  @PrimaryColumn()
  request_id: RequestEntity['request_id'];

  @PrimaryColumn()
  username: UserEntity['username'];

  @ManyToOne(() => RequestEntity, (request) => request.assignees)
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.requestAssignees)
  @JoinColumn({ name: 'username' })
  user: UserEntity;
}
