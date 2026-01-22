import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Provider } from '../entities/tb-user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  createUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  findById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { userId: id },
    });
  }

  findByUuid(uuid: string): Promise<User | null> {
    return this.repository.findOne({
      where: { uuid },
    });
  }

  findByProvider(provider: Provider, providerId: string): Promise<User | null> {
    return this.repository.findOne({
      where: { provider, providerId },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
