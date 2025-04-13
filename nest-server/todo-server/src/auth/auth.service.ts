import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<{ token: string; user: any }> {
    const newUser = await this.usersService.create(createUserDto);
    return this.createSendToken(newUser);
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    // Check if email and password exist
    if (!email || !password) {
      throw new BadRequestException('Please provide email and password!');
    }

    // Check if user exists and password is correct
    const user = await this.usersService.findByEmailWithPassword(email);
    
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isPasswordCorrect = await user.correctPassword(password, user.password);
    
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // If everything is ok, send token to client
    return this.createSendToken(user);
  }

  private signToken(userId: string): string {
    return this.jwtService.sign({ id: userId });
  }

  private createSendToken(user: UserDocument): { token: string; user: any } {
    // Use the _id property 
    const token = this.signToken(user._id.toString());
    
    // Remove password from output
    const userObject = user.toObject();
    delete userObject.password;
    
    return {
      token,
      user: userObject,
    };
  }
}
