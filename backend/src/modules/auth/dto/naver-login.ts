import { IsNotEmpty, IsString } from 'class-validator';

export class NaverLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}
