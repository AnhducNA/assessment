import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/users/services/user.service';
import { UsersRepository } from '@modules/users/repositories/user.repository';
import { CustomizeException } from '@exception/customize.exception';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private userService: UserService,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async login(params: any) {
    const { email, password } = params;
    const user = await this.userRepository.validateUser(email, password);
    if (user) {
      const payload = { id: user.id, email: user.email, role: user.role };
      if (payload) {
        return this.jwtService.sign(JSON.parse(JSON.stringify(payload)));
      }
    } else {
      throw new CustomizeException(
        this.i18n.t('message.IS_INCORRECT_EMAIL_OR_PASSWORD'),
      );
    }
  }
}
