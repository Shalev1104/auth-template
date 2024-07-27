import { ProviderNotExistException } from '@auth/domain/exceptions/OAuth/provider-not-exist.exception';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const OAuthProviderParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const [firstLetter, ...restOfWord] = request.params.provider;
    const formattedProvider = firstLetter.toUpperCase() + restOfWord.join('');
    if (formattedProvider in OAuthProvider) return formattedProvider;
    throw new ProviderNotExistException();
  },
);
