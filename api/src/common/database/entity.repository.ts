import { MongoPrismaService } from './prisma/mongo/mongo.service';
import { PostgresPrismaService } from './prisma/postgres/postgres.service';

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

type DbAdapters = MongoPrismaService | PostgresPrismaService;
abstract class EntityRepository<Service extends DbAdapters> {
  constructor(protected readonly prisma: Service) {}
}

export class MongoRepository extends EntityRepository<MongoPrismaService> {
  constructor() {
    const dbClient = new MongoPrismaService();
    super(dbClient);
  }
}

export class PostgresRepository extends EntityRepository<PostgresPrismaService> {
  constructor() {
    const dbClient = new PostgresPrismaService();
    super(dbClient);
  }
}
