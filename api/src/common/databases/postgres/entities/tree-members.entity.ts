import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './users.entity';
import { TreeEntity } from './trees.entity';
import { TreeRolesEntity } from './tree-roles.entity';

@Entity({ name: 'tree_members' })
export class TreeMemberEntity {
  @PrimaryColumn()
  tree_id: TreeEntity['tree_id'];

  @PrimaryColumn()
  username: UserEntity['username'];

  @ManyToOne(() => TreeRolesEntity, (treeRole) => treeRole.members, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role' })
  role: TreeRolesEntity;

  @ManyToOne(() => TreeEntity, (tree) => tree.members)
  @JoinColumn({ name: 'tree_id' })
  tree: TreeEntity;

  @ManyToOne(() => UserEntity, (user) => user.treeMembers)
  @JoinColumn({ name: 'username' })
  user: UserEntity;
}
