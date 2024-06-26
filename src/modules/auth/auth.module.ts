import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@modules/auth/jwt.strategy';
import { AuthController } from '@modules/auth/auth.controller';
import { env } from '@env';
import { AssessmentModule } from '@modules/assessment/assessment.module';

@Module({
  imports: [
    UserModule,
    AssessmentModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: env.jwt.secret,
      signOptions: { expiresIn: env.jwt.expires },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
