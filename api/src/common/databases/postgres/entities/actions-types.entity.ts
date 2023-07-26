import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { RequestActionEntity } from './request-actions.entity';

@Entity({ name: 'action_types' })
export class ActionsTypesEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  type_id: string;

  @Column({ type: 'varchar', length: 64 })
  type_name: string;

  @OneToMany(
    () => RequestActionEntity,
    (requestAction) => requestAction.action_type,
  )
  types: RequestActionEntity[];
}
