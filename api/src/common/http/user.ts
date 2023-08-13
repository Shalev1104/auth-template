import { Uuid } from 'src/common/ddd/uuid';
export { AuthStrategy } from '@prisma/postgres/client';

export type UserId = Uuid;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';
