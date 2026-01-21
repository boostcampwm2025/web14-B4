import { v4 as uuidv4 } from 'uuid';

// UUID v4를 사용하여 State 값 생성
export function generateRandomState(): string {
  return uuidv4();
}
