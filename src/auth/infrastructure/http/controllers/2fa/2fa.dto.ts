import { VerificationId } from '@auth/domain/entities/Verification.entity';
import { VerificationCode } from '@auth/domain/value-objects/VerificationCode';
import { OTPChannel } from '@common/infrastructure/database/typeorm/enums/OtpChannel.enum';
import { z } from 'zod';

export const SetupVerificationDto = z.object({
  channelId: z.nativeEnum(OTPChannel),
  setAsDefault2fa: z.boolean().default(false),
});
export type SetupVerificationDto = z.infer<typeof SetupVerificationDto>;

export const ConfirmVerificationDto = z.object({
  code: VerificationCode,
});
export type ConfirmVerificationDto = z.infer<typeof ConfirmVerificationDto>;

export const Enable2FADto = z.object({
  verificationId: VerificationId,
});
export type Enable2FADto = z.infer<typeof Enable2FADto>;

export const Set2FADto = z.object({
  verificationId: VerificationId.optional(),
});
export type Set2FADto = z.infer<typeof Set2FADto>;
