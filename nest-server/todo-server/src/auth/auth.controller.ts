import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const { token, user } = await this.authService.signup(createUserDto);
    return {
      status: 'success',
      token,
      data: { user }
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { token, user } = await this.authService.login(loginDto.email, loginDto.password);
    return {
      status: 'success',
      token,
      data: { user }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Request() req) {
    return {
      status: 'success',
      data: {
        user: req.user
      }
    };
  }
}
