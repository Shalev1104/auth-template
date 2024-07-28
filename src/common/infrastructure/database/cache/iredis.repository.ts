export interface IRedisRepository {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string | number | Buffer,
    ttlInSeconds?: number,
  ): Promise<void>;
  delete(key: string): Promise<void>;
  ttl(key: string): Promise<number>;
}

export const IRedisRepository = Symbol('IRedisRepository');
