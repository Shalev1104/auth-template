import { z } from 'zod';
import { v4 } from 'uuid';

export const Uuid = z.string().uuid();
export type Uuid = z.infer<typeof Uuid>;

export const generateUuidOrValue = (uuid?: Uuid): Uuid => uuid || v4();
