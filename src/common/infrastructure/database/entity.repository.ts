export type RepositoryGetAll<T> = (queryParams?: any) => Promise<T[]>;
export type RepositoryGet<T> = (id: string) => Promise<T | undefined>;
export type RepositorySave<T> = (object: T) => Promise<T>;
export type RepositoryDelete<T> = (id: string) => Promise<T | undefined>;

export interface IRepository<T> {
  getAll: RepositoryGetAll<T>;
  get: RepositoryGet<T>;
  save: RepositorySave<T>;
  delete: RepositoryDelete<T>;
}
