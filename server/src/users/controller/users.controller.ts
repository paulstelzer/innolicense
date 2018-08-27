import { Get, Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor() { }

  @Get()
  root() {
    return 'Hello World';
  }
}