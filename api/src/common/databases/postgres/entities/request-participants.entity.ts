import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { RequestEntity } from './requests.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'request_participants' })
export class RequestParticipantEntity {
  @PrimaryColumn()
  request_id: RequestEntity['request_id'];

  @PrimaryColumn()
  username: UserEntity['username'];

  @ManyToOne(() => RequestEntity, (request) => request.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.requestParticipants)
  @JoinColumn({ name: 'username' })
  user: UserEntity;
}
