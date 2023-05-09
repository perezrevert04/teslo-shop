import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@email.es'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'MyPassword123!!',
    minLength: 6,
    pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

  @ApiProperty({
    description: 'User fullname',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;
}
