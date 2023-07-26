import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TreeMemberEntity } from './tree-members.entity';
import { SubstatusEntity } from './sub-statuses.entity';
import { RequestEntity } from './requests.entity';

@Entity({ name: 'trees' })
export class TreeEntity {
  @PrimaryGeneratedColumn('uuid')
  tree_id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  tree_name: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @OneToMany(() => RequestEntity, (request) => request.tree_id)
  requests: RequestEntity[];

  @OneToMany(() => SubstatusEntity, (substatus) => substatus.substatus_id)
  substatuses: SubstatusEntity[];

  @OneToMany(() => TreeMemberEntity, (treeMember) => treeMember.tree)
  members: TreeMemberEntity[];
}
