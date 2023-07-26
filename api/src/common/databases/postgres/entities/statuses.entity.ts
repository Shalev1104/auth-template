import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { RequestEntity } from './requests.entity';

@Entity({ name: 'statuses' })
export class StatusEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  status_id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  status_name: string;

  @OneToMany(() => RequestEntity, (request) => request.status)
  requests: RequestEntity[];
}
