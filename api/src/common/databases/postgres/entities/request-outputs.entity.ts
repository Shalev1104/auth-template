import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { RequestEntity } from './requests.entity';

@Entity({ name: 'request_outputs' })
export class RequestOutputEntity {
  @PrimaryColumn({ type: 'varchar' })
  input_id: string;

  @PrimaryColumn({ type: 'varchar' })
  node_id: string;

  @Column()
  request_id: RequestEntity['request_id'];

  @Column({ type: 'varchar' })
  value: string;

  @ManyToOne(() => RequestEntity, (request) => request.outputs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;
}
