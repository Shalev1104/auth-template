import { Injectable, Logger } from '@nestjs/common';
import { Saga, IEvent, ofType, ICommand } from '@nestjs/cqrs';
import {
  Observable,
  groupBy,
  mergeMap,
  throttleTime,
  map,
  BehaviorSubject,
  tap,
} from 'rxjs';
import { SendVerificationCodeCommand } from '../commands/verification/send-verification-code.command';
import { RequestedOtpVerificationCodeEvent } from '@auth/domain/events/requested-otp-verification.event';
import {
  EmailVerificator,
  OtpVerificator,
  PhoneCallVerificator,
  SmsVerificator,
} from '@auth/application/services/verification/verificator.service';
import { OtpVerification } from '@auth/domain/value-objects/VerificationCode';

@Injectable()
export class VerificationSaga {
  private readonly validationCodeThrottleTimeInSeconds = 60;
  private readonly services = new Map<OtpVerification, OtpVerificator>();

  constructor(
    private readonly emailVerificator: EmailVerificator,
    private readonly smsVerificator: SmsVerificator,
    private readonly phoneCallVerificator: PhoneCallVerificator,
  ) {
    this.services.set(OtpVerification.enum.Email, this.emailVerificator);
    this.services.set(OtpVerification.enum.SMS, this.smsVerificator);
    this.services.set(OtpVerification.enum.Call, this.phoneCallVerificator);
  }

  @Saga()
  RequestedOtpVerification = (
    event$: Observable<IEvent>,
  ): Observable<ICommand> => {
    const throttleDurationInMs =
      this.validationCodeThrottleTimeInSeconds * 1000;
    const lastAllowedTime$ = new BehaviorSubject(0);

    const calculateRemainingTime = () => {
      const currentTime = Date.now();
      const lastAllowedTime = lastAllowedTime$.getValue();
      const remainingTime = Math.max(
        0,
        (lastAllowedTime + throttleDurationInMs - currentTime) / 1000,
      );
      return remainingTime;
    };

    return event$.pipe(
      ofType(RequestedOtpVerificationCodeEvent),
      groupBy((event) => event.user.userId),
      mergeMap((group$) =>
        group$.pipe(
          tap(() => {
            calculateRemainingTime();
          }),
          throttleTime(throttleDurationInMs),
          tap(() => {
            lastAllowedTime$.next(Date.now());
          }),
        ),
      ),
      map(
        ({ user, id, channelId, verificationStore, resend }) =>
          new SendVerificationCodeCommand(
            user,
            id,
            this.services.get(channelId)!,
            verificationStore,
            resend,
          ),
      ),
    );
  };
}
