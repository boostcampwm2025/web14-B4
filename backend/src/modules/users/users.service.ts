import { Injectable } from '@nestjs/common';
import { TbUserChecklistProgressRepository } from '../../datasources/repositories/tb-user-checklist-progress.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userChecklistProgressRepository: TbUserChecklistProgressRepository,
  ) {}
}
