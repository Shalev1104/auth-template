import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Request } from 'express';
import { map, catchError } from 'rxjs/operators';
import { UserWithEmailAndPasswordLogin } from '@auth/domain/User.aggregate';
import { TotpService } from '@auth/application/services/verification/totp.service';
import { OTPChannel } from '@common/infrastructure/database/typeorm/enums/OtpChannel.enum';

@Injectable()
export class Transform2FAInterceptor implements NestInterceptor {
  constructor(private readonly totpService: TotpService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<UserWithEmailAndPasswordLogin>,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    const { channelId } = request.body;

    return next.handle().pipe(
      map(async (user) => {
        switch (channelId) {
          case OTPChannel.Email:
            return 'Sending confirmation email, check your inbox to proceed. Wait a minute before asking for a new code.';
          case OTPChannel.SMS:
            return 'Sending confirmation SMS, check your messages to proceed. Wait a minute before asking for a new code.';
          case OTPChannel.Call:
            return 'Expect a call shortly to proceed. Wait a minute before asking for a new code.';
          case OTPChannel.Authenticator:
            return {
              otpauthUrl: await this.totpService.getOtpauthUrl(
                user.emailAndPasswordLogin.sharedSecret!,
                user.emailAndPasswordLogin.emailAddress,
              ),
              base32: user.emailAndPasswordLogin.sharedSecret!,
            };
        }
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }
}
