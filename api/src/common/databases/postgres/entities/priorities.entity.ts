import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { RequestEntity } from './requests.entity';

@Entity({ name: 'priorities' })
export class PriorityEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  priority_id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  priority_name: string;

  @Column({ type: 'integer', unique: true })
  order: number;

  @OneToMany(() => RequestEntity, (request) => request.priority)
  requests: RequestEntity[];
}
