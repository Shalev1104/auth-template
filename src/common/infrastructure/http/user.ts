import { Uuid } from 'src/common/domain/uuid';

export type UserId = Uuid;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';
