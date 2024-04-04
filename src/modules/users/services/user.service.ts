import { Injectable, UseGuards } from '@nestjs/common';
import { UsersRepository } from '@modules/users/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from '@entities/user.entity';
import { plainToClass } from 'class-transformer';
import {
  createUserInterface,
  FindUserInterface,
} from '@interfaces/user.interface';
import { RoleEnum } from '@enum/role.enum';
import { Repository } from 'typeorm';
import { HrGame } from '@entities/hrGame.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UsersRepository,
    @InjectRepository(HrGame)
    private hrGameRepository: Repository<HrGame>,
  ) {}

  async findAll() {
    const userList = await this.usersRepository.find();
    return userList;
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async checkOrCreateUser(params: FindUserInterface) {
    let user: User = await this.usersRepository.findOne({
      where: {
        email: params.email,
      },
    });
    if (!user) {
      // Don't have user in DB => create user
      const paramCreate: createUserInterface = plainToClass(User, {
        email: params.email,
        password: await bcrypt.hash(params.password, 10),
        role: RoleEnum.CANDIDATE,
      });
      user = await this.usersRepository.save(paramCreate);
    }
    return user;
  }

  async getHrApproachGameByHrId(hr_id: string) {
    return await this.hrGameRepository
      .createQueryBuilder()
      .where('hr_id = :hr_id', { hr_id: hr_id })
      .getMany();
  }
  async getHrApprachGameByHrIdAndGameId(params: object) {
    return await this.hrGameRepository.findOneBy({
      hr_id: params['hr_id'],
      game_id: params['game_id'],
    });
  }
  async createHrApproachGame(params: object) {
    return await this.hrGameRepository.save(params);
  }
}
