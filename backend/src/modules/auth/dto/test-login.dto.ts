import { IsString, IsOptional } from 'class-validator';

export class TestLoginDto {
  @IsString()
  @IsOptional()
  username?: string;
}
