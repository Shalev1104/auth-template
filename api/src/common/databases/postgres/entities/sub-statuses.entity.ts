import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { TreeEntity } from './trees.entity';
import { StatusEntity } from './statuses.entity';
import { RequestEntity } from './requests.entity';

@Entity({ name: 'substatuses' })
export class SubstatusEntity {
  @PrimaryColumn()
  status_id: string;

  @PrimaryGeneratedColumn('uuid')
  substatus_id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  substatus_name: string;

  @Column()
  tree_id: string;

  @ManyToOne(() => StatusEntity, (status) => status.status_id)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @ManyToOne(() => TreeEntity, (tree) => tree.substatuses)
  @JoinColumn({ name: 'tree_id' })
  tree: TreeEntity;

  @OneToMany(() => RequestEntity, (request) => request.substatus)
  requests: RequestEntity[];
}
