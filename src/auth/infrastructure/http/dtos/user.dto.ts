import { ExternalStrategies } from '@auth/domain/value-objects/AuthCredentials.vo';
import { AuthStrategy } from '@common/infrastructure/http/user';
import { IsEmail, IsNotEmpty, IsEnum, NotEquals } from 'class-validator';

export class UserRequestDto {
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  avatarImageUrl?: string;
}

export class SocialUserRequestDto {
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  name: string;

  avatarImageUrl?: string;

  @IsEnum(AuthStrategy)
  @NotEquals(AuthStrategy.Local)
  strategy: ExternalStrategies;
}

export class UserResponseDto {
  userId: string;
  emailAddress: string;
  strategy: AuthStrategy;
  userProfile: {
    name: string;
    avatarImageUrl?: string;
  };
  lastLoginAt: Date;
}
