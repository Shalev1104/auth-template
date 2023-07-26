import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RequestEntity } from './requests.entity';

@Entity({ name: 'request_blocked_node' })
export class RequestBlockedNodeEntity {
  @PrimaryColumn({ type: 'varchar' })
  node_id: string;

  @PrimaryColumn()
  request_id: RequestEntity['request_id'];

  @ManyToOne(() => RequestEntity, (request) => request.blockedNodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;
}
