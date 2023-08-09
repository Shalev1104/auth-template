import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
