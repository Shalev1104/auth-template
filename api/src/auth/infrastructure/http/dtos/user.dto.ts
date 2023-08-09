import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRequestDto {
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
  avatarImageUrl?: string;
}

export class UserResponseDto {
  userId: string;
  emailAddress: string;
  userProfile: {
    firstName: string;
    lastName: string;
    displayName: string;
  };
  lastLoginAt: Date;
}
