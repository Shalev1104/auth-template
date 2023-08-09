import { Uuid } from 'src/common/ddd/uuid';

export type UserId = Uuid;

export enum AuthStrategy {
  Local = 'local',
  Google = 'google',
  Facebook = 'facebook',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';
