import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../types/jwt.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET', 'default_secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { _id } = payload;

    const user = await this.userRepository.findOneBy({ _id });

    if (!user) throw new UnauthorizedException('Token no valido');

    if (!user.status) throw new UnauthorizedException('Usuario no esta activo');

    return user;
  }
}
// This strategy validates the JWT token and retrieves the user from the database based on the payload's id.