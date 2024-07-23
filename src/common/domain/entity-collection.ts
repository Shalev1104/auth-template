import { Entity, EntityId } from './entity';

export class EntityCollection<TEntity extends Entity> {
  protected _entities: TEntity[];
  constructor(entities: TEntity[] = []) {
    this._entities = entities;
  }

  isEmpty() {
    return this._entities.length === 0;
  }

  has(other: TEntity | EntityId) {
    return this._entities.some((entity) => entity.equals(other));
  }

  get(other: TEntity | EntityId) {
    return this._entities.find((entity) => entity.equals(other));
  }

  add(...entities: TEntity[]) {
    this._entities.push(...entities.filter((entity) => !this.has(entity)));
  }

  delete(entity: TEntity | EntityId) {
    const index = this._entities.findIndex((e) => e.equals(entity));
    if (index !== -1) this._entities.splice(index, 1);
  }

  clear() {
    this._entities = [];
  }

  get entities() {
    return this._entities;
  }

  [Symbol.iterator]() {
    return this._entities[Symbol.iterator]();
  }
}
