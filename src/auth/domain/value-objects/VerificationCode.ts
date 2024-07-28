import { OTPChannel } from '@common/infrastructure/database/typeorm/enums/OtpChannel.enum';
import { z } from 'zod';

export const verificationDigits = 6;
const { Authenticator, ...OTPChannels } = OTPChannel;

export const TotpVerification = z.literal(Authenticator);
export type TotpVerification = z.infer<typeof TotpVerification>;

export const OtpVerification = z.nativeEnum(OTPChannels);
export type OtpVerification = z.infer<typeof OtpVerification>;

export const VerificationCode = z
  .string()
  .regex(/^[0-9]+$/, 'Only numbers are allowed')
  .length(
    verificationDigits,
    `Verification code consists of ${verificationDigits} numbers`,
  );

export type VerificationCode = z.infer<typeof VerificationCode>;

export const EncryptedVerificationCode = z.string();
export type EncryptedVerificationCode = z.infer<
  typeof EncryptedVerificationCode
>;
