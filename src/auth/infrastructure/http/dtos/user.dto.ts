import { ExternalStrategies } from '@auth/domain/value-objects/AuthCredentials.vo';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

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

  @IsEnum(OAuthProvider)
  strategy: ExternalStrategies;
}

export class UserResponseDto {
  userId: string;
  emailAddress: string;
  strategy: OAuthProvider;
  userProfile: {
    name: string;
    avatarImageUrl?: string;
  };
  lastLoginAt: Date;
}
