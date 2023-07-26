import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { RequestEntity } from './requests.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'request_files' })
export class RequestFileEntity {
  @PrimaryGeneratedColumn('uuid')
  file_id: string;

  @Column()
  request_id: RequestEntity['request_id'];

  @Column({ type: 'varchar' })
  name: string;

  @Column()
  uploaded_by: UserEntity['username'];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date;

  @ManyToOne(() => RequestEntity, (request) => request.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.requestFiles)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: UserEntity;
}
