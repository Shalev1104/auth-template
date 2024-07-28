import { OTPChannel } from '@common/infrastructure/database/typeorm/enums/OtpChannel.enum';
import { z } from 'zod';

export const SetupVerificationDto = z.object({
  channelId: z.nativeEnum(OTPChannel),
  setAsDefault2fa: z.boolean().default(false),
});
export type SetupVerificationDto = z.infer<typeof SetupVerificationDto>;
