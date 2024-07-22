import { RepositorySave } from '@common/infrastructure/database/entity.repository';
import { User } from '../User.model';

export type GetUserById = (userId: string) => Promise<User | undefined>;
export type GetUserByEmail = (userId: string) => Promise<User | undefined>;

export type SaveUser = RepositorySave<User>;

export interface IUserRepository {
  getUserById: GetUserById;
  getUserByEmail: GetUserByEmail;
  save: SaveUser;
}
