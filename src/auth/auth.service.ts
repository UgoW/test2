import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password' | 'refreshTokenHash'>> {
    const existing = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepository.create({
      email: registerDto.email,
      password: await this.hashPassword(registerDto.password),
    });

    const savedUser = await this.usersRepository.save(user);
    const { password, refreshTokenHash, ...result } = savedUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async logout(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.refreshTokenHash = null;
    await this.usersRepository.save(user);
    return { loggedOut: true };
  }

  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: jwtConstants.accessTokenExpiresIn as any,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: jwtConstants.refreshTokenExpiresIn as any,
      }),
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await this.hashPassword(refreshToken);
    await this.usersRepository.update(userId, { refreshTokenHash });
  }

  async getUserIfRefreshTokenMatches(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) {
      return null;
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (isMatch) {
      return user;
    }
    return null;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
