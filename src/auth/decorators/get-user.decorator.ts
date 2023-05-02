import {
  InternalServerErrorException,
  createParamDecorator
} from '@nestjs/common';

export const GetUser = createParamDecorator((_, ctx) => {
  const { user } = ctx.switchToHttp().getRequest();

  if (!user) throw new InternalServerErrorException('User not found');

  return user;
});
