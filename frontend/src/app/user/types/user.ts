export interface UserProfile {
  id: string; // UUID를 문자열로 가져올 것
  name: string;
  profileImage?: string;
  grade: 'bronze' | 'silver' | 'gold' | 'platinum';
  interests: string[]; // 관심분야
}
