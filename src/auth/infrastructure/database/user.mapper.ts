import { Injectable } from '@nestjs/common';
import { User } from '@auth/domain/User.aggregate';
import { OAuthLogin } from '@auth/domain/entities/OAuthLogin.entity';
import { Verification } from '@auth/domain/entities/Verification.entity';
import { EmailAndPasswordLogin } from '@auth/domain/entities/EmailAndPasswordLogin.entity';
import { TwoFactorAuthentication } from '@auth/domain/entities/TwoFactorAuthentication.entity';
import {
  nullToUndefinedOrValue,
  undefinedToNullOrValue,
  executeOrUndefined,
} from '@common/infrastructure/http/casts';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { UserResponseDto } from '../http/controllers/auth/auth.dto';

@Injectable()
export class UserMapper {
  toDomain = (persistence: UserSchema) => {
    return new User({
      userId: persistence.userId,
      createdAt: persistence.createdAt,
      phone: nullToUndefinedOrValue(persistence.phone),
      userProfile: {
        name: persistence.name,
        avatarImageUrl: nullToUndefinedOrValue(persistence.avatarImageUrl),
      },
      oAuthLogins: persistence.oAuthLogins.map(
        (el) =>
          new OAuthLogin({
            ...el,
            data: {
              avatarImageUrl: nullToUndefinedOrValue(el.avatarImageUrl),
              emailAddress: nullToUndefinedOrValue(el.emailAddress),
            },
          }),
      ),
      emailAndPasswordLogin: executeOrUndefined(
        persistence.emailAndPasswordLogin,
        (emailAndPasswordLogin) =>
          new EmailAndPasswordLogin({
            loginId: emailAndPasswordLogin.loginId,
            emailAddress: emailAndPasswordLogin.emailAddress,
            hashedPassword: emailAndPasswordLogin.hashedPassword,
            sharedSecret: nullToUndefinedOrValue(
              emailAndPasswordLogin.totpSharedSecret,
            ),
            verifications: emailAndPasswordLogin.verifications.map(
              (verification) =>
                new Verification({
                  channelId: verification.channelId,
                  verificationId: verification.verificationId,
                }),
            ),
            twoFactorAuthentication: executeOrUndefined(
              emailAndPasswordLogin.twoFactorAuthentication,
              (twoFactorAuthentication) =>
                new TwoFactorAuthentication({
                  verificationId: twoFactorAuthentication.verificationId,
                }),
            ),
          }),
      ),
    });
  };

  toPersistence = (user: User): UserSchema =>
    ({
      userId: user.userId,
      name: user.name,
      createdAt: user.createdAt,
      avatarImageUrl: undefinedToNullOrValue(user.avatarImageUrl),
      phone: undefinedToNullOrValue(user.phone),
      lastLoginAt: user.lastLoginAt,
      emailAndPasswordLogin: executeOrUndefined(
        user.emailAndPasswordLogin,
        (e) => ({
          userId: user.userId,
          loginId: e.loginId,
          emailAddress: e.emailAddress,
          hashedPassword: e.hashedPassword,
          totpSharedSecret: undefinedToNullOrValue(e.sharedSecret),
          verifications: [...e.verifications].map((v) => ({
            verificationId: v.verificationId,
            userId: user.userId,
            channelId: v.channelId,
          })),
          twoFactorAuthentication: undefinedToNullOrValue(
            executeOrUndefined(
              user.emailAndPasswordLogin?.twoFactorAuthentication,
              (twoFactorAuthentication) => ({
                userId: user.userId,
                verificationId: twoFactorAuthentication.verificationId,
              }),
            ),
          ),
        }),
      ),
      oAuthLogins: [...user.oAuthLogin].map((oa) => ({
        userId: user.userId,
        providerId: oa.providerId,
        providerName: oa.providerName,
        avatarImageUrl: undefinedToNullOrValue(oa.avatarImageUrl),
        emailAddress: undefinedToNullOrValue(oa.emailAddress),
      })),
    } as UserSchema);

  toResponseDTO = (user: User): UserResponseDto => ({
    userId: user.userId,
    name: user.name,
    avatarImageUrl: user.avatarImageUrl,
    phone: user.phone,
    accounts: user.getLoginAccounts(),
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  });
}
