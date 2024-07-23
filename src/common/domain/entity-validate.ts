import { z, ZodTypeAny } from 'zod';
import { BadRequestException } from '@nestjs/common';

export function validateSchema<T extends ZodTypeAny>(
  schema: T,
  data: z.infer<T>,
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new BadRequestException(error);
  }
}
