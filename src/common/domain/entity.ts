import { z } from 'zod';
import { generateUuidOrValue } from './value-objects/Uuid';

export const EntityId = z.union([z.number(), z.string()]);
export type EntityId = z.infer<typeof EntityId>;

export abstract class Entity<T = EntityId> {
  protected readonly entityId: T;
  protected constructor(entityId?: T) {
    this.entityId = entityId ?? (generateUuidOrValue() as T);
  }

  equals(other: Entity | EntityId) {
    if (other instanceof Entity) return this.equalsByEntity(other);
    return this.equalsById(other);
  }

  private equalsById(otherId: EntityId) {
    return this.entityId === otherId;
  }
  private equalsByEntity(other: Entity) {
    return this.entityId === other.entityId;
  }
}
