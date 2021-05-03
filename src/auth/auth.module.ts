import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import * as config from "config";
const jwtConfig = config.get('jwt');

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([UserRepository]),    
    JwtModule.register({
    secret: jwtConfig['secret'],
    signOptions: {
      expiresIn: 3600
    }
  })],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
