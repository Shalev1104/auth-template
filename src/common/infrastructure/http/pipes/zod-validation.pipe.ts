import { validateSchema } from '@common/domain/entity-validate';
import {
  PipeTransform,
  ValidationPipe,
  HttpStatus,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ZodTypeAny, z } from 'zod';

@Injectable({ scope: Scope.REQUEST })
export class ZodValidationPipe<TSchema extends ZodTypeAny>
  extends ValidationPipe
  implements PipeTransform
{
  constructor(private readonly schema: TSchema) {
    super({
      whitelist: true, // remove request body that not appeared in dto
      transform: true, // transform the request object to fit dto
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  }

  transform = (data: z.infer<TSchema>) => validateSchema(this.schema, data);
}
