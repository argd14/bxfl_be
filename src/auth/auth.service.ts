import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './types/jwt.interface';
import { log } from 'console';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    getAuthStatus() {
        return { status: 'ok' };
    }

    async register(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;
            const user = this.userRepository.create({
                ...userData,
                password: await bcrypt.hashSync(password, 10),
            });
            await this.userRepository.save(user);
            user.password = ''; // Remove password from the response
            return {
                ...user,
                // token: this.getJwtToken({_id: user._id, name: user.name}),
            };
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

      async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, _id: true, name: true },
    });
    if (!user) throw new UnauthorizedException('Credenciales no validas');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales no son validas');

    return {
      ...user,
    //   token: this.getJwtToken({ _id: user._id, name: user.name }),
    };
  }

    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        console.log(token);
        return token;
    }
    private handleDBErrors(error: any) {
        if (error.code === '23505') throw new BadRequestException(error.detail);
        console.log(error);
        throw new InternalServerErrorException('Internal Server Error');
    }
}
