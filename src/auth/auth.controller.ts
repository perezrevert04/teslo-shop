import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

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
  @RoleProtected(ValidRoles.ADMIN)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return user;
  }

  @Get('private3')
  @Auth(ValidRoles.ADMIN)
  privateRoute3(@GetUser() user: User) {
    return user;
  }
}
