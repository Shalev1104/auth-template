import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { TreeMemberEntity } from './tree-members.entity';

@Entity({ name: 'tree_roles' })
export class TreeRolesEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  role: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 256 })
  description: string;

  @OneToMany(() => TreeMemberEntity, (member) => member.role)
  members: TreeMemberEntity[];
}
