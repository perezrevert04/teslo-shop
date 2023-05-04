import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @Headers() headers: IncomingHttpHeaders,
    @RawHeaders() rawHeaders: any
  ) {
    console.log(request);
    console.log(user);
    console.log(headers);
    console.log(rawHeaders);

    return {
      user,
      headers,
      rawHeaders
    };
  }

  @Get('private2')
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return user;
  }
}
